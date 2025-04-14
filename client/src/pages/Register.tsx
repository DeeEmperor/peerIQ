import AuthForm from "@/components/auth/AuthForm";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <AuthForm type="register" />
      </div>
    </div>
  );
}
