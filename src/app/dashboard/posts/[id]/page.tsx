"use client"

import DashboardLayout from "@/components/DashboardLayout"
import TipTapEditor from "@/components/TipTapEditor"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState("")
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchPost()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch post")
      }
      const { post } = await response.json()
      setTitle(post.title)
      setSlug(post.slug)
      setSummary(post.excerpt || "")
      setContent(post.content)
      setStatus(post.status)
    } catch (error) {
      console.error("Error fetching post:", error)
      alert("Failed to load post")
      router.push("/dashboard/posts")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (newStatus?: "draft" | "published") => {
    if (!title || !content) {
      alert("Please provide a title and content")
      return
    }

    setIsSaving(true)
    const statusToSave = newStatus || status

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          summary,
          content,
          status: statusToSave,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save post")
      }

      setStatus(statusToSave)
      alert("Post saved successfully!")
    } catch (error) {
      console.error("Error saving post:", error)
      alert("Failed to save post. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete post")
      }

      router.push("/dashboard/posts")
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Edit Post</h1>
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-red-600 rounded-md shadow-sm text-sm font-medium text-red-400 bg-gray-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Post
          </button>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full rounded-md bg-gray-800 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
              placeholder="Enter post title..."
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="block w-full rounded-md bg-gray-800 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
              placeholder="post-url-slug"
            />
            <p className="mt-1 text-sm text-gray-400">
              URL: /blog/{slug}
            </p>
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-300 mb-2">
              Summary
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="block w-full rounded-md bg-gray-800 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
              placeholder="Brief description of the post..."
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <div className="flex items-center space-x-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  status === "published"
                    ? "bg-green-900 text-green-300 border border-green-700"
                    : "bg-yellow-900 text-yellow-300 border border-yellow-700"
                }`}
              >
                {status === "published" ? "Published" : "Draft"}
              </span>
              {status === "draft" && (
                <button
                  onClick={() => handleSave("published")}
                  disabled={isSaving}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Publish Now
                </button>
              )}
              {status === "published" && (
                <button
                  onClick={() => handleSave("draft")}
                  disabled={isSaving}
                  className="text-sm text-gray-400 hover:text-gray-300"
                >
                  Unpublish
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content
            </label>
            <TipTapEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your post..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-6 border-t border-gray-700">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard/posts")}
                className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Posts
              </button>
              {status === "published" && (
                <a
                  href={`/blog/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Post
                  <svg className="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}