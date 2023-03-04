import { Suspense } from 'react'

import BlogList from './components/blog/blog-list'
import BlogNewButton from './components/blog/blog-new-button'
import Loading from './loading'
import type { SearchType } from '../utils/blog.types'

// メインページ
const Page = ({ searchParams }: SearchType) => {
  return (
    <div className="h-full">
      <BlogNewButton />
      {/* 非同期対応 */}
      <Suspense fallback={<Loading />}>
        {/* @ts-ignore*/}
        <BlogList searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

export default Page
