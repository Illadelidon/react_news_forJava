import {Button, Col, Collapse, Form, Input, Pagination, Row, Select} from "antd";
import {Link, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {IGetPosts, IPostSearch} from "../types.ts";
import http_common from "../../../../http_common.ts";
import {ISelectItem} from "../../../helpers/types.ts";
import PostCard from "./PostCard.tsx";

const PostListPage = () => {
    const [data, setData] = useState<IGetPosts>({
        list: [],
        totalCount: 0
    });

    const [categories, setCategories] = useState<ISelectItem[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        http_common.get<ISelectItem[]>("/api/categories/names")
            .then(resp=> {
                //console.log("list categories", resp.data);
                setCategories(resp.data);
            });
    },[]);

    const [formParams, setFormParams] = useState<IPostSearch>({
        name: searchParams.get('name') || "",
        description: searchParams.get('name') || "",
        categoryId: Number(searchParams.get('categoryId')) || 0,
        page: Number(searchParams.get('page')) || 1,
        size: Number(searchParams.get('size')) || 3
    });

    const [form] = Form.useForm<IPostSearch>();

    const onSubmit = async (values: IPostSearch) => {
        findCategories({...formParams, page: 1, name: values.name, description: values.description, categoryId: values.categoryId});
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response =
                    await http_common
                        .get<IGetPosts>(`/api/posts/search`,
                            {
                                params: {
                                    ...formParams,
                                    page: formParams.page-1
                                }
                            });

                setData(response.data);
                // setLoading(false);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        // setLoading(true);
        fetchData();
    }, [JSON.stringify(formParams)]);

    const {list,  totalCount } = data;

    //Todo Make new request after deleting
    const handleDelete = async (categoryId: number) => {
        try {
            await http_common.delete(`/api/posts/${categoryId}`);
            setData({ ...data, list: list.filter(x => x.id != categoryId)});
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    };

    const handlePageChange = async (page: number, newPageSize: number) => {
        findCategories({...formParams, page, size: newPageSize});
    };

    const findCategories = (model: IPostSearch) => {
        setFormParams(model);
        updateSearchParams(model);
    }

    const updateSearchParams = (params : IPostSearch) =>{
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== 0) {
                searchParams.set(key, value);
            } else {
                searchParams.delete(key);
            }
        }
        setSearchParams(searchParams);
    };

    return (
        <>
            <h1>List of Posts</h1>

            <Link to={"/post/create"}>
                <Button type="primary" style={{margin: '5px'}}>
                    ADD +
                </Button>
            </Link>
            <Collapse defaultActiveKey={0}>
                <Collapse.Panel key={1} header={"Search Panel"}>
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
                                name="keywordName"
                                htmlFor="keywordName"
                            >
                                <Input autoComplete="keyword"/>
                            </Form.Item>

                            <Form.Item
                                label="Description"
                                name="keywordDescription"
                                htmlFor="keywordDescription"
                            >
                                <Input autoComplete="keyword"/>
                            </Form.Item>

                            <Form.Item
                                label="Категорія"
                                name="categoryId"
                                htmlFor="categoryId"
                            >
                                <Select
                                    defaultValue={"Усі категорії"}
                                >
                                    <Select.Option value="0">Усі категорії</Select.Option>
                                    {
                                        categories.map(x=> (
                                            <Select.Option value={x.id}>{x.name}</Select.Option>
                                        ))
                                    }

                                </Select>
                            </Form.Item>

                            <Row style={{display: 'flex', justifyContent: 'center'}}>
                                <Button style={{margin: 10}} type="primary" htmlType="submit">
                                    Search
                                </Button>
                                <Button style={{margin: 10}} htmlType="button" onClick={() => {
                                }}>
                                    Cansel
                                </Button>
                            </Row>
                        </Form>
                    </Row>
                </Collapse.Panel>
            </Collapse>
            <Row style={{width: '100%', display: 'flex', marginTop: '25px', justifyContent: 'center'}}>
                <Pagination
                    showTotal={(total, range) => {
                        console.log("range ", range);
                        return (`${range[0]}-${range[1]} із ${total} записів`);
                    }}
                    current={(formParams.page)}
                    pageSize={formParams.size}
                    total={totalCount}
                    onChange={handlePageChange}
                    pageSizeOptions={[3, 6, 12, 24]}
                    showSizeChanger
                />
            </Row>

            <Row gutter={16}>
                <Col span={24}>
                    <Row>
                        {data.list.length === 0 ? (
                            <h2>List is Empty</h2>
                        ) : (
                            data.list.map((item) =>
                                <PostCard key={item.id} item={item} handleDelete={handleDelete} />,
                            )
                        )}
                    </Row>
                </Col>
            </Row>

            <Row style={{width: '100%', display: 'flex', marginTop: '25px', justifyContent: 'center'}}>
                <Pagination
                    showTotal={(total, range) => {
                        console.log("range ", range);
                        return (`${range[0]}-${range[1]} із ${total} записів`);
                    }}
                    current={(formParams.page)}
                    pageSize={formParams.size}
                    total={totalCount}
                    onChange={handlePageChange}
                    pageSizeOptions={[3, 6, 12, 24]}
                    showSizeChanger
                />
            </Row>
        </>
    );
}
export default PostListPage;
