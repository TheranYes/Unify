export default function RedirectIfNoToken() {
  const token = localStorage.getItem("token");
  
  if (!token) {
    window.location.href = 'http://localhost:5173/login';
  }

  return null;
}
