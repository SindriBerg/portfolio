export default async function Page() {
  async function getData() {
    const data = await fetch('/api');
    return data;
  }
  const data = await getData();
  return (
    <div>
      <h1>Page</h1>
    </div>
  )
}