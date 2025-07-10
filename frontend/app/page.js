import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <img src="/images/gato.jpg" alt="image" />

      <div>
      <Checkbox {...label} defaultChecked />
      <Checkbox {...label} />
      <Checkbox {...label} disabled />
      <Checkbox {...label} disabled checked />
    </div>
    </div>
  );
}
