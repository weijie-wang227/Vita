import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IPost extends Document {
  title: string
  userId: Types.ObjectId
  imageUrl: string
  description: string
  classId: Types.ObjectId
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true , ref: 'User'},
    imageUrl: { type: String },
    description: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class'},
  },
  { timestamps: true }
)

export interface IComment extends Document {
  userId: Types.ObjectId
  content: string
  postId: Types.ObjectId
}

const commentSchema = new Schema<IComment>(
  {
    userId: { type: Schema.Types.ObjectId, required: true , ref: 'User'},
    content: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, required: true, ref: 'Post'},
  },
  { timestamps: true }
)

export const Post = mongoose.model<IPost>('Post', postSchema)
export const Comment = mongoose.model<IComment>('Comment', commentSchema)