import {NavigateFunction, useNavigate} from "react-router-dom";
import {ICategoryCreate} from "../types.ts";
import {Button, Form, Input, Row} from "antd";
import http_common from "../../../../http_common.ts";
import TextArea from "antd/es/input/TextArea";


const CategoryCreatePage = () =>{
    const navigate :NavigateFunction = useNavigate();



    const [form]=Form.useForm<ICategoryCreate>();


const onSubmit = async (values: ICategoryCreate)=>{

    try{
        await http_common.post("/api/categories",values, {
            headers:{
                'Content-Type':'multipart/form-data',
            },
        });
        navigate('/admin/category');
    }
    catch (ex){
        console.log("Exception create category",ex);
    }


}


    return (
        <>
            <h1>Create Category</h1>
            <Row gutter={16}>
                <Form form={form}
                      onFinish={onSubmit}
                      layout={"vertical"}
                      style={{
                          minWidth:'100%',
                          display:'flex',
                          flexDirection:'column',
                          justifyContent:'center',
                          padding:20,
                      }}
                      >
                    <Form.Item
                        label="Name"
                        name="name"
                        htmlFor="name"
                        rules={[
                            {required:true,message:'Це поле є обов`язковим'},
                            {min:3,message:'Назва повинна містити мінімум 3 символи!'},
                        ]}
                    >
                        <Input autoComplete="name"/>
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        htmlFor="description"
                        rules={[
                            {required: true, message: 'It is a required field!'},
                            {min: 10, message: 'Name must have at least 10 symbols!'},
                        ]}
                    >
                        <TextArea/>
                    </Form.Item>


                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Button style={{margin: 10}} type="primary" htmlType="submit">
                            Додати
                        </Button>
                        <Button style={{margin: 10}} htmlType="button" onClick={() =>{ navigate('/')}}>
                            Скасувати
                        </Button>
                    </Row>
                </Form>
            </Row>
        </>
    )
}

export default CategoryCreatePage;