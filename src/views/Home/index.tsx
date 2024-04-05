import { Col, Pagination, Row} from "antd";
import {useSearchParams} from "react-router-dom";
import {IPostSearch, IGetPosts} from "../../components/admin/post/types.ts";
import http_common from "../../http_common.ts";
import {useEffect, useState} from "react";

import PostCard from "./PostCard.tsx";

const HomePage = () => {
    const [data, setData] = useState<IGetPosts>({
        list: [],
        totalCount: 0
    });
    const handleDelete = async (categoryId: number) => {
        try {
            await http_common.delete(`/api/posts/${categoryId}`);
            setData({ ...data, list: list.filter(x => x.id != categoryId)});
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    };
    const [searchParams, setSearchParams] = useSearchParams();

    const [formParams, setFormParams] = useState<IPostSearch>({
        keyword: searchParams.get('keyword') || "",
        page: Number(searchParams.get('page')) || 1,
        size: Number(searchParams.get('size')) || 8
    });

    //const [form] = Form.useForm<IPostSearch>();

    // const onSubmit = async (values: IPostSearch) => {
    //     findPosts({...formParams, page: 1, keyword: values.keyword});
    // }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response =
                    await http_common.get<IGetPosts>(`/api/posts/search?keyword=${formParams.keyword}&page=${(formParams.page - 1)}&size=${formParams.size}`);
                console.log("response.data", response.data)
                setData(response.data);
                // setLoading(false);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        // setLoading(true);
        fetchData();
    }, [JSON.stringify(formParams)]);

    const {list, totalCount} = data;

    const handlePageChange = async (page: number, newPageSize: number) => {
        findPosts({...formParams, page, size: newPageSize});
    };

    const findPosts = (model: IPostSearch) => {
        setFormParams(model);
        updateSearchParams(model);
    }

    const updateSearchParams = (params: IPostSearch) => {
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
            <h1 style={{textAlign: "center"}}>News</h1>

            <Row gutter={16}>
                <Col span={24}>
                    <Row>
                        {list.length === 0 ? (
                            <h2>Список пустий</h2>
                        ) : (
                            list.map((item) =>
                                <PostCard key={item.id} item={item} handleDelete={handleDelete}  />,
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
                    current={formParams.page}
                    pageSize={formParams.size}
                    total={totalCount}
                    onChange={handlePageChange}
                    pageSizeOptions={[4, 8, 12, 20]}
                    showSizeChanger
                />
            </Row>
        </>
    );
}

export default HomePage;