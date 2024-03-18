import {Button, Layout, Menu} from 'antd';
import {Link, useLocation, useNavigate} from 'react-router-dom';

const {Header} = Layout;


const ButtonStyle = {
    margin: '0 10px 0 0',
};
const DefaultHeader = () => {
    const location = useLocation();
    const navigateTo = useNavigate();



    const handleSignInClick = () => {
        navigateTo('/login')
    };

    const handleRegisterClick = () => {
        // Navigate to the login form when the button is clicked
        navigateTo('/register')
    };

    return (
        <Header style={{display: 'flex', alignItems: 'center'}}>
            <div className="demo-logo"/>
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[location.pathname.substr(1)]} // Highlight the selected menu item
                style={{flex: 1, minWidth: 0}}
            >
                <Menu.Item key={"products"}>
                    <Link to={`/product`}>Продукти</Link>
                </Menu.Item>
            </Menu>

            <>
                <Button style={ButtonStyle} onClick={handleSignInClick}>
                    Sign-In
                </Button>
                <Button onClick={handleRegisterClick}>Register</Button>
            </>

        </Header>
    );
};

export default DefaultHeader;

