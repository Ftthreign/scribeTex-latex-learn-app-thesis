import { ref } from 'vue'

export interface ArticleSummary {
  id: number
  title: string
  created_at: string
  updated_at: string
  author: {
    name: string
    email: string
  }
}

export interface ArticleDetail extends ArticleSummary {
  content: string
  is_published: boolean
}

export const useArticles = () => {
  const articles = ref<ArticleSummary[]>([])
  const currentArticle = ref<ArticleDetail | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchArticles = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<{ statusCode: number; data: ArticleSummary[] }>('/api/articles')
      articles.value = response.data
    } catch (e: any) {
      error.value = e?.statusMessage || 'Gagal mengambil daftar artikel panduan'
    } finally {
      loading.value = false
    }
  }

  const fetchArticleById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<{ statusCode: number; data: ArticleDetail }>(`/api/articles/${id}`)
      currentArticle.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e?.statusMessage || 'Gagal mengambil detail artikel'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    articles,
    currentArticle,
    loading,
    error,
    fetchArticles,
    fetchArticleById,
  }
}
