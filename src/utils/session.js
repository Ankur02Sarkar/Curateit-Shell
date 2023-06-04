
class Session {
  get token() {
    return localStorage.getItem("token") || null
  }

  setToken = (token) => {
    localStorage.setItem("token", token)
  }
  get email() {
    return localStorage.getItem("email") || null
  }

  setEmail = (email) => {
    localStorage.setItem("user", email)
  }
  get username() {
    return localStorage.getItem("username") || null
  }

  setUser = (username) => {
    localStorage.setItem("username", username)
  }

  get unfiltered_collection_id() {
    return localStorage.getItem("unfiltered_collection_id") || null
  }
  setCollectionId = (unfiltered_collection_id) => {
    localStorage.setItem("unfiltered_collection_id", unfiltered_collection_id)
  }


  setUserId = (id) => {
    localStorage.setItem("userId", id)
  }

  get userId() {
    return localStorage.getItem("userId") || null
  }

  setCollectionData(data) {
    localStorage.removeItem("collectionData")
    localStorage.setItem("collectionData", data)
  }

  get collectionData() {
    return localStorage.getItem("collectionData") || []
  }

  clear = () => {
    localStorage.clear()
  }
}

export default new Session();
