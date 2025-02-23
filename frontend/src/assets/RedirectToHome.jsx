export default function RedirectToHome() {
    const token = localStorage.getItem("token");
    
    if (token) {
      window.location.href = 'http://localhost:5173/';
    }
  
    return null;
  }
  