import {Route, Routes} from "react-router-dom";
import DefaultLayout from "./components/containers/default/DefaultLayout.tsx";
import CategoryListPage from "./components/admin/category/list/CategoryListPage.tsx";
import CategoryCreatePage from "./components/admin/category/create/CategoryCreatePage.tsx";
import CategoryEditPage from "./components/admin/category/edit/CategoryEditPage.tsx";
import TestPage from "./components/test";
import PostCreatePage from "./components/admin/post/create/PostCreatePage.tsx";
import PostListPage from "./components/admin/post/list/PostListPage.tsx";
import PostEditPage from "./components/admin/post/edit/PostEditPage.tsx";
import Login from "./views/Login";
import Register from "./views/Register";
import AdminLayout from "./components/containers/admin/AdminLayout.tsx";
import HomePage from "./views/Home";

//import CategoryListPage from "./components/containers/category/list/CategoryListPage.tsx";

const App = () => (
    <Routes>



        <Route path="/" element={<DefaultLayout />}>
            <Route index element={<HomePage/>}/>

            <Route path={"login"} element={<Login/>}/>
            <Route path={"register"} element={<Register/>}/>

            <Route path={"test"} element={<TestPage/>}/>

        </Route>

            <Route path={"/admin"} element={<AdminLayout/>}>
                <Route path={"category"}>
                    <Route index element={<CategoryListPage/>}/>
                    <Route path={"create"} element={<CategoryCreatePage/>}/>
                    <Route path={"edit/:id"} element={<CategoryEditPage/>}/>
                </Route>
                <Route path={"post"}>
                    <Route index element={<PostListPage/>}/>
                    <Route path={"create"} element={<PostCreatePage/>}/>
                    <Route path={"edit/:id"} element={<PostEditPage/>}/>
                </Route>
            </Route>


    </Routes>
);

export default App;