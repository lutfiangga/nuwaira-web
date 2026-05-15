<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import {
		Newspaper,
		Image,
		FileText,
		Database,
		Code2,
		UploadCloud,
		Link,
		Trash2,
		Globe,
        Eye,
		Folder,
		FolderOpen,
		FileCode
	} from '@lucide/svelte';
</script>

<div class="space-y-12">
	<div>
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">News Module</h1>
		<p class="leading-7 [&:not(:first-child)]:mt-6 text-xl text-muted-foreground">
			Complete content management system for news articles with rich text editing.
		</p>
	</div>

	<!-- Features Overview -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div
				class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400"
			>
				<Newspaper class="h-8 w-8" />
			</div>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Features</h2>
				<p class="text-muted-foreground">What's included in the module</p>
			</div>
		</div>

		<div class="grid md:grid-cols-2 gap-6">
			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
                        <FileText class="h-5 w-5" />
                        Rich Text Editor
                    </Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground mb-4">
						Powered by <strong>Quill.js</strong>, offering a full suite of formatting tools:
					</p>
                    <ul class="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                        <li>Headers (H1-H6) & Fonts</li>
                        <li>Formatting (Bold, Italic, lists)</li>
                        <li>Colors & Alignment</li>
                        <li>Image Upload & Video Embeds</li>
                        <li>Code blocks & Quotes</li>
                    </ul>
				</Card.CardContent>
			</Card.Card>
            
			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
                        <UploadCloud class="h-5 w-5" />
                        Media Management
                    </Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground mb-4">
						Smart file handling system:
					</p>
                    <ul class="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                        <li><strong>Auto Cleanup:</strong> Deletes unused images on update/delete</li>
                        <li><strong>Thumbnails:</strong> Dedicated upload field</li>
                        <li><strong>Embeds:</strong> Auto-convert YouTube/Vimeo URLs</li>
                        <li><strong>Secure:</strong> File validation & obfuscated names</li>
                    </ul>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
                        <Link class="h-5 w-5" />
                        Automatic Slugs
                    </Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground">
						Slugs are auto-generated from the Title as you type. 
                        Once manually edited, the auto-generation stops to prevent unwanted changes.
					</p>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
                        <Globe class="h-5 w-5" />
                        Public View
                    </Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground">
						Public route at <code>/news/[slug]</code> to view articles. 
                        Admin panel provides a direct "View" button to preview content.
					</p>
				</Card.CardContent>
			</Card.Card>
		</div>
	</section>

	<Separator />

    <!-- Technical Details -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div class="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
				<Code2 class="h-8 w-8" />
			</div>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Technical Implementation</h2>
				<p class="text-muted-foreground">Schema and Services</p>
			</div>
		</div>

		<div class="grid md:grid-cols-2 gap-6">
			<Card.Card class="bg-slate-950 text-slate-50">
				<Card.CardHeader>
					<Card.CardTitle class="text-slate-50 flex items-center gap-2">
                        <Database class="h-5 w-5" />
                        Database Schema
                    </Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<pre class="overflow-x-auto text-xs font-mono"><code
							>const news = pgTable('news', {'{'}
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(), // HTML
  thumbnail: text('thumbnail'),       // Path
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
{'}'});</code
						></pre>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle>File Structure</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<div class="space-y-1 text-xs">
						<div class="flex items-center gap-2">
							<FolderOpen class="h-3.5 w-3.5 text-blue-500" />
							<span class="font-semibold">lib/app/modules/news/</span>
						</div>
						<div class="flex items-center gap-2 ml-4">
							<Folder class="h-3.5 w-3.5 text-blue-400" />
							<span class="font-medium">services/</span>
						</div>
						<div class="flex items-center gap-2 ml-8">
							<FileCode class="h-3.5 w-3.5 text-slate-500" />
							<span>news.service.ts</span>
							<span class="text-muted-foreground ml-2"># API service layer</span>
						</div>
						<div class="flex items-center gap-2 ml-4">
							<Folder class="h-3.5 w-3.5 text-blue-400" />
							<span class="font-medium">forms/</span>
						</div>
						<div class="flex items-center gap-2 ml-8">
							<FileCode class="h-3.5 w-3.5 text-slate-500" />
							<span>news.form.ts</span>
							<span class="text-muted-foreground ml-2"># Form field configuration</span>
						</div>
						<div class="flex items-center gap-2 mt-2">
							<FolderOpen class="h-3.5 w-3.5 text-blue-500" />
							<span class="font-semibold">routes/panel/news/</span>
						</div>
						<div class="flex items-center gap-2 ml-4">
							<FileCode class="h-3.5 w-3.5 text-purple-500" />
							<span>+page.svelte</span>
							<span class="text-muted-foreground ml-2"># Admin panel UI</span>
						</div>
						<div class="flex items-center gap-2 mt-2">
							<FolderOpen class="h-3.5 w-3.5 text-blue-500" />
							<span class="font-semibold">routes/news/[slug]/</span>
						</div>
						<div class="flex items-center gap-2 ml-4">
							<FileCode class="h-3.5 w-3.5 text-purple-500" />
							<span>+page.svelte</span>
							<span class="text-muted-foreground ml-2"># Public article view</span>
						</div>
					</div>
				</Card.CardContent>>
			</Card.Card>
		</div>
	</section>
    
    <Separator />

    <!-- How to Use -->
    <section class="space-y-4">
        <h2 class="text-2xl font-bold tracking-tight">Usage Guide</h2>
        
        <div class="grid gap-4">
            <div class="border rounded-lg p-4">
                <h3 class="font-semibold mb-2 flex items-center gap-2">
                     <Image class="h-4 w-4" />
                     Uploading Images
                </h3>
                <p class="text-sm text-muted-foreground">
                    Click the <strong>Image</strong> icon in the editor toolbar. Images are uploaded immediately to the server and inserted into the content.
                    Thumbnails are uploaded separately via the "Thumbnail" field.
                </p>
            </div>
            
            <div class="border rounded-lg p-4">
                <h3 class="font-semibold mb-2 flex items-center gap-2">
                     <Eye class="h-4 w-4" />
                     Viewing Articles
                </h3>
                <p class="text-sm text-muted-foreground">
                    In the admin table, click the <strong>View</strong> (eye icon) button in the Actions column to open the article in a new tab.
                </p>
            </div>

            <div class="border rounded-lg p-4">
                <h3 class="font-semibold mb-2 flex items-center gap-2">
                     <Trash2 class="h-4 w-4" />
                     Deleting Content
                </h3>
                <p class="text-sm text-muted-foreground">
                    Deleting a news article will <strong>automatically delete</strong> its thumbnail and all images embedded in its content.
                </p>
            </div>
        </div>
    </section>
</div>
