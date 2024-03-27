



import {Route, Routes} from "react-router-dom";
import DefaultLayout from "./components/containers/default/DefaultLayout.tsx";
import CategoryListPage from "./components/containers/category/list/CategoryListPage.tsx";
import CategoryCreatePage from "./components/containers/category/create/CategoryCreatePage.tsx";
import CategoryEditPage from  "./components/containers/category/edit/CategoryEditPage.tsx";
import TestPage from "./components/test";
import PostCreatePage from "./components/containers/post/create/PostCreatePage.tsx";
import PostListPage from "./components/containers/post/list/PostListPage.tsx";
import PostEditPage from "./components/containers/post/edit/PostEditPage.tsx";
import Login from "./views/Login";
//import CategoryListPage from "./components/containers/category/list/CategoryListPage.tsx";

const App = () => (
    <Routes>
        <Route path="/" element={<DefaultLayout />}>
            <Route index element={<CategoryListPage/>}/>
            <Route path={"category"}>
                <Route path={"create"} element={<CategoryCreatePage/>}/>
                <Route path={"edit/:id"} element={<CategoryEditPage/>}/>
            </Route>
            <Route path={"test"} element={<TestPage/>}/>


            <Route path={"login"} element={<Login/>}/>

            <Route path={"post"}>
                <Route index element={<PostListPage/>}/>
                <Route path={"create"} element={<PostCreatePage/>}/>
                <Route path={"edit/:id"} element={<PostEditPage/>}/>
            </Route>
        </Route>
    </Routes>
);

export default App;