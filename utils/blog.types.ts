export interface BlogListType {
  id: string
  created_at: string
  title: string
  content: string
  user_id: string
  image_url: string
  name: string | null
  avatar_url: string | null
  comments: CommentType[]
}

export interface LikeType {
  user_id: string
}

export interface ProfileType {
  avatar_url: string | null
  name: string | null
}

export interface CommentType {
  id: string
  content: string
  created_at: string
  profiles: ProfileType
  likes: LikeType[]
}
