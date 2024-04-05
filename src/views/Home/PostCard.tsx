import { Card, Col,  Typography} from "antd";
import Meta from "antd/es/card/Meta";

import NotImage from '../../assets/imagenot.png';

import {IPostItem} from "../../components/admin/post/types.ts";
import {APP_ENV} from "../../env";

const { Title } = Typography;

interface IPostCardProps {
    item: IPostItem,
    handleDelete: (id: number) => void
}

const PostCard: React.FC<IPostCardProps> = (props) => {
    const {item} = props;
    const { name, files, description} = item;

    console.log("item", item)

    return (
        <>
            <Col style={{padding: 20, marginBottom: 50}} xxl={8} lg={12} md={18} sm={28}>
                <Card
                    bodyStyle={{flex: '1', paddingBlock: '10px'}}
                    style={{height: 380, display: 'flex', flexDirection: 'column', paddingTop: '40px'}}
                    hoverable
                    cover={
                        <img
                            style={{height: '150px', objectFit: 'contain'}}
                            alt={name}
                            src={files[0] ? `${APP_ENV.BASE_URL}/uploading/300_${files[0]}` : NotImage}
                            //src={files[0]}


                        />

                    }

                >

                    <Meta
                        title={name}
                        description={
                            <>
                                <Title level={5} >{description.substring(0, 200)} ...</Title>
                            </>
                        }

                    />
                </Card>
            </Col>
        </>
    )
}

export default PostCard;