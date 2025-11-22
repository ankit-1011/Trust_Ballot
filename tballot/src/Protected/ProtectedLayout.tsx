import Menu from '@/Pages/Menu';
import { Outlet } from 'react-router-dom';

const ProtectedLayout = () => {
  return (
    <div>
        <Menu/>
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;