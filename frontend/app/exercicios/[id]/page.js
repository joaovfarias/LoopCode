export default async function ExerciciosPage({params}) {
  const { id } = await params;
  return (
    <div>
      <h1>Exercício {id}</h1>
    </div>
  );
}