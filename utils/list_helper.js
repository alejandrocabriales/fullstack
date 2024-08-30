const dummy = (blogs) => {
    return 1
  }

  const totalLikes=(blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }

const favoriteBlog = (blogs) => {
    const mostLikes = Math.max(...blogs.map((blog) => blog.likes))
    return blogs.find((blog) => blog.likes === mostLikes)
}
  
const mostBlogs = (blogs) => {
  const authorCount =new  Map();
     blogs
      .map((blog) => {
        authorCount.set(blog.author, (authorCount.get(blog.author) || 0) + 1)
        return blog
      })

const maxValue=Math.max(...authorCount.values())
const authorKey=Array.from(authorCount.keys()).find((key) => authorCount.get(key) === maxValue) 
return{
  author: authorKey,
  blogs: maxValue
}
}
const mostLikes = (blogs) => {
  const authorLikes =new  Map();
     blogs
      .map((blog) => {
        authorLikes.set(blog.author, (authorLikes.get(blog.author) || 0) + blog.likes)
        return blog
      })

const maxValue=Math.max(...authorLikes.values())
const authorKey=Array.from(authorLikes.keys()).find((key) => authorLikes.get(key) === maxValue) 
return{
  author: authorKey,
  likes: maxValue
}



}





  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }
