import type { Preview } from '@storybook/vue3-vite';
import '../themes/base.css';
import '../themes/glassmorphism.css';
import '../themes/memphis.css';
import '../themes/cyberpunk.css';
import '../stories/catalog.css';
const preview: Preview = {parameters:{layout:'fullscreen',a11y:{test:'error'},options:{storySort:{order:['Overview','Components']}}}};
export default preview;
