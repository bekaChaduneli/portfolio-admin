import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, List, Form, message, Modal, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { IPosts, PostsInitialValues } from "../types/Posts";
import { GET_POSTS } from "@graphql/query";
import { uploadToCloudinary } from "../services/cloudinaryService";
import Dragger from "antd/es/upload/Dragger";
import { CREATE_POST, DELETE_POSTS, UPDATE_POSTS } from "@graphql/mutation";
import TextArea from "antd/es/input/TextArea";

const Posts = () => {
  const { data, loading, error } = useQuery(GET_POSTS);
  const [deleteOnePost] = useMutation(DELETE_POSTS, {
    refetchQueries: [{ query: GET_POSTS }],
    onCompleted: () => {
      message.success("Posts deleted successfully!");
    },
    onError: (error) => {
      console.log(error.message);
      message.error(error.message);
    },
  });
  const handleDelete = (id: string) => {
    deleteOnePost({ variables: { id } });
  };

  const [form] = Form.useForm();
  const [currentPosts, setCurrentPosts] = useState<IPosts | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setLoadingImage(true);
      const result = await uploadToCloudinary(file);
      setImage(result.secure_url);
    } catch {
      message.error("Error uploading file.");
    } finally {
      setLoadingImage(false);
    }
  };

  useEffect(() => {
    if (currentPosts) {
      currentPosts.image && setImage(currentPosts.image);
    } else {
      setImage(null);
    }
  }, [currentPosts]);

  const [createOnePosts] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
    onCompleted: () => message.success("Post created successfully!"),
    onError: (error) => message.error(error.message),
  });

  const [updateOnePosts] = useMutation(UPDATE_POSTS, {
    refetchQueries: [{ query: GET_POSTS }],
    onCompleted: () => message.success("Post updated successfully!"),
    onError: (error) => message.error(error.message),
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async (values: PostsInitialValues) => {
    try {
      await createOnePosts({
        variables: {
          input: {
            image: image,
            link: values.link,
            likes: parseInt(values.likes),
            commentsSum: parseInt(values.commentsSum),
            translations: {
              createMany: {
                data: [
                  {
                    description: values.enDescription,
                    languageCode: "en",
                  },
                  {
                    description: values.kaDescription,
                    languageCode: "ka",
                  },
                ],
              },
            },
            linkedin: { connect: { id: "1" } },
          },
        },
      });
      setImage(null);
      form.resetFields();
      setCurrentPosts(null);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleUpdate = async (values: PostsInitialValues) => {
    try {
      await updateOnePosts({
        variables: {
          id: currentPosts?.id,
          data: {
            image: { set: image },
            link: { set: values.link },
            likes: { set: parseInt(values.likes) },
            commentsSum: { set: parseInt(values.commentsSum) },
            translations: {
              updateMany: [
                {
                  where: { languageCode: { equals: "en" } },
                  data: {
                    description: { set: values.enDescription },
                  },
                },
                {
                  where: { languageCode: { equals: "ka" } },
                  data: {
                    description: { set: values.kaDescription },
                  },
                },
              ],
            },
          },
        },
      });
      form.resetFields();
      setCurrentPosts(null);
      setImage(null);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleCancel = () => {
    setCurrentPosts(null);
    setImage(null);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEdit = (posts: IPosts) => {
    setCurrentPosts(posts);
    setIsModalVisible(true);

    const en = posts.translations.find((t) => t.languageCode === "en");
    const ka = posts.translations.find((t) => t.languageCode === "ka");

    const initialValues: PostsInitialValues = {
      link: posts.link,
      likes: posts.likes.toString(),
      commentsSum: posts.commentsSum.toString(),
      enDescription: en?.description,
      kaDescription: ka?.description,
    };
    form.setFieldsValue(initialValues);
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
        style={{
          maxWidth: "208px",
        }}
      >
        Add New Post
      </Button>

      <List
        dataSource={data?.findManyPosts || []}
        renderItem={(posts: IPosts) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(posts)}>
                Edit
              </Button>,
              <Button type="link" danger onClick={() => handleDelete(posts.id)}>
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta title={posts.link} />
          </List.Item>
        )}
      />

      <Modal
        title={currentPosts ? "Edit Post" : "Create Post"}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1200}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentPosts) {
              handleUpdate(values);
            } else {
              handleCreate(values);
            }
          });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={currentPosts ? handleUpdate : handleCreate}
        >
          <Form.Item label="Image">
            <Dragger
              name="file"
              customRequest={({ file, onSuccess }) => {
                handleFileUpload(file as File);
                onSuccess?.({});
              }}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                <PlusOutlined />
              </p>
              <p className="ant-upload-text">Click or drag to upload image</p>
            </Dragger>
            {image && (
              <img
                src={image}
                alt="uploaded"
                style={{ width: 100, height: 100, marginTop: 10 }}
              />
            )}
          </Form.Item>
          <Form.Item label="Link" name="link" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Comments Sum"
            name="commentsSum"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Likes" name="likes" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="English Description"
            name="enDescription"
            rules={[{ required: true }]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            label="Georgian Description"
            name="kaDescription"
            rules={[{ required: true }]}
          >
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Posts;
