import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { posts, users } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user?.email !== "george.diablo@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt))
    return NextResponse.json({ posts: allPosts })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user?.email !== "george.diablo@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, slug, summary, content, status } = body

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 })
    }

    // Get the current user's ID from the database
    const [currentUser] = await db.select().from(users).where(eq(users.email, session.user?.email!))
    
    const [newPost] = await db.insert(posts).values({
      title,
      slug,
      excerpt: summary,
      content,
      status: status || "draft",
      authorId: currentUser.id,
    }).returning()

    return NextResponse.json({ post: newPost })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}