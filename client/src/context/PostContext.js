

import { createContext, useReducer } from "react";

export const PostsContext = createContext()

export const PostsReducer =(state, action)=>{
    switch(action.type){
        case 'SET_POSTS':
         return {
           posts: action.payload
           }
        case 'CREATE_POST':
            return{
                posts:[action.payload,...state.posts]
            }
        case 'DELETE_POST':
  return {
    posts: state.posts.filter((p) => p._id !== action.payload)
  }
      default:
        return state
    }
 
}
export const PostsContextProvider = ({children})=>{
    const[state, dispatch]=useReducer(PostsReducer,{
        posts:null
    })
    
    return(
        <PostsContext.Provider value={{...state, dispatch}}
        >
          {children}
        </PostsContext.Provider>
    )
}