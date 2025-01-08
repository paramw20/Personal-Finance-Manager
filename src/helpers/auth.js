export const registerUser = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if username already exists
    if (users.find(user => user.username === userData.username)) {
      throw new Error('Username already exists');
    }
    
    // Add new user
    users.push({
      username: userData.username,
      password: userData.password, 
      id: crypto.randomUUID()
    });
    
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  export const loginUser = (credentials) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      user => user.username === credentials.username && 
      user.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid username or password');
    }
    
    // Set auth token
    localStorage.setItem('authToken', user.id);
    localStorage.setItem('userName', JSON.stringify(user.username));
    
    return user;
  }
  
  export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
  }
  
  export const checkAuth = () => {
    return localStorage.getItem('authToken') !== null;
  }