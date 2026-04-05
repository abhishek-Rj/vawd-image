export default function Profile() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Profile Page</h1>
      <p className="text-lg">
        This is the profile page. Only authenticated users can see this.
      </p>
    </div>
  );
}
