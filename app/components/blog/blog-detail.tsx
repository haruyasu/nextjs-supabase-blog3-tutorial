'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../supabase-provider'
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline'

import Link from 'next/link'
import useStore from '../../../store'
import Image from 'next/image'
import Loading from '../../loading'
import BlogComment from './blog-comment'

import type { BlogDetailType } from '../../../utils/blog.types'
type PageProps = {
  blog: BlogDetailType
}

// ブログ詳細
const BlogDetail = ({ blog }: PageProps) => {
  const { supabase } = useSupabase()
  const router = useRouter()
  const { user } = useStore()
  const [myBlog, setMyBlog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [login, setLogin] = useState(false)

  useEffect(() => {
    // ログインチェック
    if (user.id != '') {
      setLogin(true)

      // 自分が投稿したブログチェック
      if (user.id === blog.profiles.id) {
        setMyBlog(true)
      }
    }
  }, [user])

  // ブログ削除
  const deleteBlog = async () => {
    setLoading(true)

    // supabaseブログ削除
    const { error } = await supabase.from('blogs').delete().eq('id', blog.id)

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    // ファイル名取得
    const fileName = blog.image_url.split('/').slice(-1)[0]

    // 画像を削除
    await supabase.storage.from('blogs').remove([`${user.id}/${fileName}`])

    // トップページに遷移
    router.push(`/`)
    router.refresh()

    setLoading(false)
  }

  // 自分が投稿したブログのみ、編集削除ボタンを表示
  const renderButton = () => {
    if (myBlog) {
      return (
        <div className="flex justify-end mb-5">
          {loading ? (
            <Loading />
          ) : (
            <div className="flex items-center space-x-2">
              <Link href={`blog/${blog.id}/edit`}>
                <PencilSquareIcon className="h-5 w-5 text-green-500 hover:brightness-110" />
              </Link>
              <div className="cursor-pointer" onClick={() => deleteBlog()}>
                <TrashIcon className="h-5 w-5 text-red-500 hover:brightness-110" />
              </div>
            </div>
          )}
        </div>
      )
    }
  }

  return (
    <div className="max-w-screen-md mx-auto">
      <div className="flex flex-col items-center justify-center mb-5">
        <div className="mb-1">
          <Image
            src={blog.profiles.avatar_url ? blog.profiles.avatar_url : '/default.png'}
            className="rounded-full"
            alt="avatar"
            width={70}
            height={70}
          />
        </div>
        <div className="font-bold text-gray-500">{blog.profiles.name}</div>
        <div className="text-sm text-gray-500">
          {format(new Date(blog.created_at), 'yyyy/MM/dd HH:mm')}
        </div>
      </div>

      <div className="mb-5">
        <div className="text-center font-bold text-3xl mb-5">{blog.title}</div>
        <div className="mb-5">
          <Image
            src={blog.image_url}
            className="rounded-lg aspect-video object-cover"
            alt="image"
            width={1024}
            height={576}
          />
        </div>
        <div className="leading-relaxed break-words whitespace-pre-wrap">{blog.content}</div>
      </div>

      {renderButton()}

      <BlogComment blog={blog} login={login} />
    </div>
  )
}

export default BlogDetail
