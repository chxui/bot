import { createRoot } from 'react-dom/client';
import { Portfolio } from '../app/page';
import '../app/globals.css';
const version = new URLSearchParams(window.location.search).get('version');
const heroVersion = version === 'purple' || version === 'separated' ? version : 'classic';
createRoot(document.getElementById('root')!).render(<Portfolio designer heroVersion={heroVersion} />);
