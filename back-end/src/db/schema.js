import { pgTable , serial , text , timestamp , integer } from 'drizzle-orm/pg-core'

export const favouritesTable = pgTable('favourites' , {
  id : serial('id').primaryKey(),
  userId : text('user_id').notNull(),
  recepeId : integer('recepe-Id').notNull(),
  title : text('title').notNull(),
  iamge : text('image'),
  cookTime : text('cook_time'),
  servings : text('servings'),
  createdAt : timestamp('created_at').notNull().defaultNow()
})