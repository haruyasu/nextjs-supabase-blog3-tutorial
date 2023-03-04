import { notFound } from 'next/navigation'
import { createClient } from '../../../utils/supabase-server'
import type { BlogListType, SearchType } from '../../../utils/blog.types'

import BlogItem from './blog-item'
import BlogPagination from './blog-pagination'

// ページネーション
const getPagination = (page: number, size: number) => {
  const page2 = page - 1
  const from = page2 !== 0 ? page2 * size : 0
  const to = page2 ? from + size - 1 : size - 1
  return { from, to }
}

// ブログリスト
const BlogList = async ({ searchParams }: SearchType) => {
  const supabase = createClient()
  const per_page = 6 // 1ページのブログ数

  // クエリパラメータからページを取得
  let page = 1
  if (Object.keys(searchParams).length) {
    page = parseInt(searchParams.page, 10)
  }

  const { from, to } = getPagination(page, per_page)

  // ブログリスト取得
  const { data: blogsData, count } = await supabase
    .from('blogs')
    .select('id, created_at, title, content, image_url, profiles(id, name, avatar_url)', {
      count: 'exact',
    })
    .order('created_at', { ascending: false }) // コメント投稿順に並び替え
    .returns<BlogListType>() // 型を指定
    .range(from, to)

  // ブログリストが見つからない場合
  if (!blogsData) return notFound()

  return (
    <div>
      <div className="grid grid-cols-3 gap-5 mb-10">
        {blogsData.map((blog) => {
          return <BlogItem key={blog.id} {...blog} />
        })}
      </div>

      <div className="flex justify-center items-center">
        {blogsData.length != 0 && <BlogPagination allCnt={count!} perPage={per_page} />}
      </div>
    </div>
  )
}

export default BlogList
