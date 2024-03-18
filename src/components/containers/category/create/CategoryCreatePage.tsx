import {NavigateFunction, useNavigate} from "react-router-dom";
import {ICategoryCreate} from "../types.ts";
import {Button, Form, Input, Row} from "antd";
import http_common from "../../../../http_common.ts";


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
        navigate('/');
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