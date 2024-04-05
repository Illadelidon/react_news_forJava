import {Button, Popconfirm, Table} from "antd";
import {Link} from "react-router-dom";
import {ColumnsType} from "antd/es/table";
import {ICategoryItem, IGetCategories} from "../types.ts";
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import http_common from "../../../../http_common.ts";
import {useEffect, useState} from "react";
import type {GetProp, TableProps} from 'antd';
import qs from 'qs';


type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;


interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const getRandomuserParams = (params: TableParams) => ({
    size: params.pagination?.pageSize,
    page: params.pagination?.current == undefined ? 1 : params.pagination.current - 1,
    ...params,
});

const CategoryListPage = () => {

    const columns: ColumnsType<ICategoryItem> = [
        {
            title: 'Id',
            dataIndex: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            render: (_, record) => (
                <Link to={`/admin/category/edit/${record.id}`}>
                    <Button type="primary" icon={<EditOutlined/>}>
                        Змінить
                    </Button>
                </Link>

            ),
        },
        {
            title: 'Delete',
            dataIndex: 'delete',
            render: (_, record) => (

                <Popconfirm
                    title="Are you sure to delete this category?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button icon={<DeleteOutlined/>}>
                        Delete
                    </Button>
                </Popconfirm>

            ),
        },
    ];

    const [data, setData] = useState<ICategoryItem[]>([]);

    const [loading, setLoading] = useState(false);

    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 5,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response =
                    await http_common.get<IGetCategories>(`/api/categories?${qs.stringify(getRandomuserParams(tableParams))}`);

                console.log("response.data", response.data)
                setData(response.data.content);
                setLoading(false);

                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: response.data.totalElements,
                    },
                });

            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        setLoading(true);
        fetchData();
    }, [JSON.stringify(tableParams)]);

    const handleDelete = async (categoryId: number) => {
        try {
            await http_common.delete(`/api/categories/${categoryId}`);
            setData(data.filter(x => x.id != categoryId));
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    };


    const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    return (
        <>
            <h1>Список категорій</h1>
            <Link to={"/admin/category/create"}>
                <Button type="primary" style={{margin: '5px'}}>
                    Add category
                </Button>

            </Link>

            <Table
                columns={columns}
                rowKey={"id"}
                dataSource={data}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
            />

            {/*columns={columns} rowKey={"id"} dataSource={data} size="middle"/>*/}
        </>
    );
}

export default CategoryListPage;