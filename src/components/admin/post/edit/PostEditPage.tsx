import {useNavigate, useParams} from "react-router-dom";
import {Button, Form, Input, Row, Select, Upload, UploadFile, UploadProps} from "antd";
import {useEffect, useState} from "react";
import http_common from "../../../../http_common.ts";
import {IPostEdit, IPostEditPhoto, IPostItem} from "../types.ts";
import {APP_ENV} from "../../../../env";
import {ISelectItem} from "../../../helpers/types.ts";
import TextArea from "antd/es/input/TextArea";
// import {UploadChangeParam} from "antd/es/upload";
// import {IUploadedFile} from "../../category/types.ts";
import {PlusOutlined} from "@ant-design/icons";
import type { DragEndEvent } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {DndContext, PointerSensor, useSensor} from '@dnd-kit/core';
import DraggableUploadListItem from '../../../common/DraggableUploadListItem.tsx';

const PostEditPage : React.FC = () => {
    const navigate = useNavigate();

    // const [messageApi, contextHolder] = message.useMessage();

    const [categories, setCategories] = useState<ISelectItem[]>([]);

    const {id} = useParams();

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const sensor = useSensor(PointerSensor, {
        activationConstraint: { distance: 10 },
    });

    const [post, setPost] = useState<IPostItem>({
        id: 0,
        name: "",
        description: "",
        files: [],
        category_id: 0
    });

    useEffect(() => {
        http_common.get<IPostItem>(`/api/posts/${id}`)
            .then(resp=> {
                console.log("post info", resp.data);
                setPost(resp.data);
            });

        http_common.get<ISelectItem[]>("/api/categories/names")
            .then(resp=> {
                //console.log("list categories", resp.data);
                setCategories(resp.data);
            });
    },[id]);

    useEffect(() => {
        setDefaultData(post);
        form.setFieldsValue(post);
    }, [post]);

    const [form] = Form.useForm<IPostEdit>();

    const setDefaultData = (data: IPostItem | null) => {
        if (data) {
            if (data.files?.length){
                setFileList([]);
            }
            const newFileList : UploadFile[] = [];
            for (let i = 0; i < data.files.length; i++) {
                newFileList.push({
                    uid: data.files[i],
                    name: data.files[i],
                    status: 'done',
                    url: `${APP_ENV.BASE_URL}/uploading/300_${data.files[i]}`,
                });
            }
            setFileList(newFileList);

        }
    };

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            setFileList((prev) => {
                const activeIndex = prev.findIndex((i) => i.uid === active.id);
                const overIndex = prev.findIndex((i) => i.uid === over?.id);
                return arrayMove(prev, activeIndex, overIndex);
            });
        }
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const onSubmit = async (values: IPostEdit) => {

        const oldPhotos : IPostEditPhoto[] = [];
        const newPhotos: IPostEditPhoto[] = [];

        for (let i = 0; i < fileList.length; i++) {
            if (!fileList[i].size){
                oldPhotos.push({photo: fileList[i].name, priority: i});
            }
            else {
                const base64Content = fileList[i].thumbUrl?.split(",")[1];
                newPhotos.push({photo: base64Content, priority: i});
            }
        }

        const sendData: IPostEdit = {...values, id: Number(id), newPhotos: newPhotos, oldPhotos: oldPhotos};

        try {
            console.log("Send Data", sendData);
            await http_common.put("/api/posts", sendData);
            navigate('/admin/post');
        }
        catch(ex) {
            console.log("Exception create category", ex);
        }
        console.log("data submit", sendData);
    }

    const optionsData = categories?.map(item => ({label: item.name, value: item.id}));

    return (
        <>
            <h1>Редагування поста</h1>

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
                        label="Name"
                        name="name"
                        htmlFor="name"
                        rules={[
                            {required: true, message: 'It is a required field!'},
                            {min: 3, message: 'Name must have at least 3 symbols!'},
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


                    <Form.Item
                        label="Категорія"
                        name="category_id"
                        htmlFor="category_id"
                        rules={[
                            {required: true, message: 'Це поле є обов\'язковим!'},
                        ]}
                    >
                        <Select
                            placeholder="Оберіть категорію: "
                            options={optionsData}
                        />
                    </Form.Item>


                    <Form.Item
                        label="Фото"
                    >
                        <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
                            <SortableContext items={fileList.map((i) => i.uid)} strategy={horizontalListSortingStrategy}>
                                <Upload
                                    showUploadList={{showPreviewIcon: false}}
                                    beforeUpload={() => false}
                                    accept="image/*"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={handleChange}
                                    itemRender={(originNode, file) => (
                                        <DraggableUploadListItem originNode={originNode} file={file} />
                                    )}
                                >
                                    {fileList.length >= 8 ? null : uploadButton}
                                </Upload>
                            </SortableContext>
                        </DndContext>
                    </Form.Item>


                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Button style={{margin: 10}} type="primary" htmlType="submit">
                            Зберети
                        </Button>
                        <Button style={{margin: 10}} htmlType="button" onClick={() =>{ navigate('/admin/post')}}>
                            Cancel
                        </Button>
                    </Row>
                </Form>
            </Row>

        </>
    )
}

export default PostEditPage;