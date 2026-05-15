<script lang="ts">
    let { data } = $props();
    const { article } = data;
</script>

<svelte:head>
    <title>{article.title}</title>
    <meta name="description" content={article.title} />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
    <article class="space-y-6">
        <header class="space-y-4">
            <h1 class="text-4xl font-bold">{article.title}</h1>
            <div class="text-muted-foreground">
                {new Date(article.createdAt).toLocaleDateString('id-ID', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}
            </div>
        </header>

        {#if article.thumbnail}
            <img 
                src={article.thumbnail} 
                alt={article.title}
                class="w-full h-96 object-cover rounded-lg"
            />
        {/if}

        <div class="prose prose-lg dark:prose-invert max-w-none">
            {@html article.content}
        </div>
    </article>
</div>

<style>
    :global(.prose img) {
        border-radius: 0.5rem;
        margin: 1.5rem 0;
    }
</style>
