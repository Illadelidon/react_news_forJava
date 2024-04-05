import {Avatar, Button, Layout, Menu} from 'antd';
import {Link, useLocation} from 'react-router-dom';
import {UserOutlined, PoweroffOutlined} from '@ant-design/icons';
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import ButtonGroup from "antd/es/button/button-group";
import {APP_ENV} from "../../../env";
import {logout} from "../../../store/accounts/accounts.slice.ts";

const {Header} = Layout;

const DefaultHeader = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();

    const {isLogin, user} = useAppSelector(state => state.account);

    const handleLogout = () => {
        //console.log("Logout user");
        dispatch(logout());
    };

    let isAdmin = false;

    user?.roles.forEach(role=> {
        if (role.toLowerCase().includes('admin'))
            isAdmin=true;
    });

    return (
        <Header style={{display: 'flex', alignItems: 'center'}}>
            <div className="demo-logo"/>
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[location.pathname.substr(1)]} // Highlight the selected menu item
                style={{flex: 1, minWidth: 0}}
            >
                <Menu.Item key={"post"}>
                    <Link to={`/`}>Posts</Link>
                </Menu.Item>
                {isAdmin &&
                    <Menu.Item key={"admin"}>
                        <Link to={`/admin/category`}>Панель керування</Link>
                    </Menu.Item>
                }
            </Menu>

            {isLogin ? (
                <ButtonGroup size="large">
                    <Button
                        type="primary"
                        style={{display: 'flex'}}
                        icon={<Avatar  size="small" src={`${APP_ENV.BASE_URL}images/${user?.name}`}/>}
                    >
                        {user?.name}
                    </Button>
                    <Button
                        type="primary"
                        icon={<PoweroffOutlined/>}
                        onClick={() => handleLogout()}
                    />
                </ButtonGroup>

            ) : (
                <Link to="/login" style={{color: 'inherit', textDecoration: 'none'}}>
                    <Button type="primary" icon={<UserOutlined/>}>
                        Увійти
                    </Button>
                </Link>
            )}

        </Header>
    );
};

export default DefaultHeader;

