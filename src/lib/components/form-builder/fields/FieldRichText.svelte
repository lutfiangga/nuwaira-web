<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { Label } from '$lib/components/ui/label';

    let { 
        config, 
        value = $bindable()
    } = $props();

    let editorContainer = $state<HTMLElement | null>(null);
    let quill: any = null;
    let mounted = $state(false);

    onMount(() => {
        if (!browser) return;

        mounted = true;
        let active = true;

        void (async () => {
            const QuillModule = await import('quill');
            const Quill = QuillModule.default;
            await import('quill/dist/quill.snow.css');

            if (!active || !editorContainer) return;

            quill = new Quill(editorContainer, {
                theme: 'snow',
                placeholder: config.placeholder || 'Write something...',
                modules: {
                    toolbar: {
                        container: [
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'font': [] }],
                            [{ 'size': ['small', false, 'large', 'huge'] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'script': 'sub'}, { 'script': 'super' }],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
                            [{ 'indent': '-1'}, { 'indent': '+1' }],
                            [{ 'direction': 'rtl' }],
                            [{ 'align': [] }],
                            ['blockquote', 'code-block'],
                            ['link', 'image', 'video'],
                            ['clean']
                        ],
                        handlers: {
                            image: imageHandler,
                            video: videoHandler
                        }
                    }
                },
                formats: [
                    'header', 'font', 'size',
                    'bold', 'italic', 'underline', 'strike',
                    'color', 'background',
                    'script',
                    'list',
                    'indent',
                    'direction', 'align',
                    'blockquote', 'code-block',
                    'link', 'image', 'video'
                ]
            });

            if (value) {
                const delta = quill.clipboard.convert({ html: value });
                quill.setContents(delta, 'silent');
            }

            quill.on('text-change', (_delta: any, _oldDelta: any, source: string) => {
                if (source === 'user') {
                    value = quill?.getSemanticHTML() || '';
                }
            });
        })();

        return () => {
            active = false;
            quill = null;
        };
    });

    async function imageHandler() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    console.error('Upload failed:', res.status, errorData);
                    alert(`Upload failed: ${errorData.error || res.statusText}`);
                    return;
                }

                const data = await res.json();
                if (data.url) {
                    const range = quill?.getSelection();
                    if (range && quill) {
                        quill.insertEmbed(range.index, 'image', data.url, 'user');
                        quill.setSelection(range.index + 1, 0);
                    }
                } else {
                    alert('Upload failed: No URL returned');
                }
            } catch (err) {
                console.error('Upload error:', err);
                alert(`Upload error: ${err instanceof Error ? err.message : 'Unknown'}`);
            }
        };
    }

    function videoHandler() {
        let url = window.prompt('Enter video URL (YouTube, Vimeo, etc.):');
        if (!url || !quill) return;

        // Convert YouTube URLs to embed format
        if (url.includes('youtube.com/watch')) {
            const videoId = new URL(url).searchParams.get('v');
            if (videoId) {
                url = `https://www.youtube.com/embed/${videoId}`;
            }
        } else if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1].split('?')[0];
            url = `https://www.youtube.com/embed/${videoId}`;
        }
        
        // Convert Vimeo URLs to embed format
        if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
            const videoId = url.split('vimeo.com/')[1].split('?')[0];
            url = `https://player.vimeo.com/video/${videoId}`;
        }

        quill.focus();
        const range = quill.getSelection();
        if (range) {
            quill.insertEmbed(range.index, 'video', url, 'user');
            quill.setSelection(range.index + 1, 0);
        }
    }
</script>

<div class="space-y-2">
    <Label>{config.label}</Label>
    
    <!-- Hidden input to ensure content is submitted with the form -->
    <input type="hidden" name={config.name} value={value || ''} />
    
    {#if mounted}
    <div class="border rounded-md overflow-hidden bg-background">
        <div bind:this={editorContainer} class="min-h-[300px]"></div>
    </div>
    {:else}
    <div class="border rounded-md overflow-hidden bg-background">
        <div class="min-h-[300px] flex items-center justify-center text-muted-foreground">
            Loading editor...
        </div>
    </div>
    {/if}
</div>

<style>
    :global(.ql-toolbar) {
        background: hsl(var(--muted));
        border: none !important;
        border-bottom: 1px solid hsl(var(--border)) !important;
    }
    
    :global(.ql-container) {
        border: none !important;
        font-family: inherit;
    }
    
    :global(.ql-editor) {
        min-height: 250px;
        font-size: 0.95rem;
        line-height: 1.6;
    }
    
    :global(.ql-editor.ql-blank::before) {
        color: hsl(var(--muted-foreground));
        font-style: normal;
    }
    
    :global(.ql-snow .ql-stroke) {
        stroke: hsl(var(--foreground));
    }
    
    :global(.ql-snow .ql-fill) {
        fill: hsl(var(--foreground));
    }
    
    :global(.ql-snow .ql-picker-label) {
        color: hsl(var(--foreground));
    }
    
    :global(.ql-toolbar button:hover),
    :global(.ql-toolbar button:focus),
    :global(.ql-toolbar button.ql-active) {
        background: hsl(var(--accent));
    }
    
    :global(.ql-editor img) {
        max-width: 100%;
        height: auto;
        border-radius: 0.5rem;
        margin: 1rem 0;
    }
</style>
