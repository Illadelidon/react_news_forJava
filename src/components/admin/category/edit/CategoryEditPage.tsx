import {useNavigate, useParams} from "react-router-dom";

import {ICategoryEdit, ICategoryItem} from "../types.ts";
import http_common from "../../../../http_common.ts";


import {useEffect} from "react";
import {Button, Form, Input, Row} from "antd";
import TextArea from "antd/es/input/TextArea";


const CategoryEditPage = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [form] = Form.useForm<ICategoryEdit>();


    const onSubmit = async (values: ICategoryEdit) => {
        try {
            await http_common.put("/api/categories", values, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/');
        } catch (ex) {
            console.log("Exception create category", ex);
        }
    }

    useEffect(() => {
        http_common.get<ICategoryItem>(`/api/categories/${id}`)
            .then(resp => {
                const {data} = resp;
                form.setFieldsValue(data);

            })
            .catch(error => {
                console.log("Error server ", error);
            });
    }, [id]);


    return (
        <>
            <h1>Редагування категорію</h1>
            <Row gutter={16}>
                <Form form={form}
                      onFinish={onSubmit}
                      layout={"vertical"}
                      style={{
                          minWidth: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          padding: 20,
                      }}
                >
                    <Form.Item
                        name="id"
                        hidden
                    />

                    <Form.Item
                        label="Назва"
                        name="name"
                        htmlFor="name"
                        rules={[
                            {required: true, message: 'Це поле є обов\'язковим!'},
                            {min: 3, message: 'Назва повинна містити мінімум 3 символи!'},
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
                        <Button style={{margin: 10}} htmlType="button" onClick={() => {
                            navigate('/')
                        }}>
                            Скасувати
                        </Button>
                    </Row>
                </Form>
            </Row>


        </>
    )
}

export default CategoryEditPage;