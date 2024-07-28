
// import { Button, Form, Input, message, List, Modal } from "antd";
// import { useEffect, useState } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { useMutation, useQuery } from "@apollo/client";
// import { GET_BOOKS } from "@graphql/query";
// import { CREATE_BOOK, DELETE_BOOKS, UPDATE_BOOK } from "@graphql/mutation";
// import { FileUpload } from "@components/FileUpload";
// import { IBooksResponse, Book, BookTranslation } from "../types/Books";
// import { uploadToCloudinary } from "../services/cloudinaryService";

// const toolbarOptions = [
//   ["bold", "italic", "underline", "strike"],
//   ["blockquote", "code-block"],
//   ["link", "image", "video", "formula"],
//   [{ header: 1 }, { header: 2 }],
//   [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
//   [{ script: "sub" }, { script: "super" }],
//   [{ indent: "-1" }, { indent: "+1" }],
//   [{ direction: "rtl" }],
//   [{ size: ["small", false, "large", "huge"] }],
//   [{ header: [1, 2, 3, 4, 5, 6, false] }],
//   [{ color: [] }, { background: [] }],
//   [{ font: [] }],
//   [{ align: [] }],
//   ["clean"],
// ];
// const Books = () => {
//   const [form] = Form.useForm();
//   const [currentBook, setCurrentBook] = useState<Book | null>(null);
//   const [value, setValue] = useState<string>("");
//   const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
//   const { data, loading, error } = useQuery<IBooksResponse>(GET_BOOKS);

//   const [loadingImage, setLoadingImage] = useState<boolean>(false);
//   const [imageUrl, setImageUrl] = useState<string | null>(null);

  // const [createBook] = useMutation(CREATE_BOOK, {
  //   refetchQueries: [{ query: GET_BOOKS }],
  //   onCompleted: () => {
  //     message.success("Book created successfully!");
  //   },
  //   onError: (error) => {
  //     message.error(error.message);
  //   },
  // });

  // const [updateBook] = useMutation(UPDATE_BOOK, {
  //   refetchQueries: [{ query: GET_BOOKS }],
  //   onCompleted: () => {
  //     message.success("Book updated successfully!");
  //   },
  //   onError: (error) => {
  //     console.error(error);
  //     message.error(error.message);
  //   },
  // });

  // const [deleteBook] = useMutation(DELETE_BOOKS, {
  //   refetchQueries: [{ query: GET_BOOKS }],
  //   onCompleted: () => {
  //     message.success("Book deleted successfully!");
  //   },
  //   onError: (error) => {
  //     message.error(error.message);
  //   },
  // });

//   const handleEdit = (book: Book) => {
//     setCurrentBook(book);
//     setIsModalVisible(true);

//     const en = book.translations.find(
//       (translation: BookTranslation) => translation.languageCode === "en"
//     );
//     const ka = book.translations.find(
//       (translation: BookTranslation) => translation.languageCode === "ka"
//     );

//     const initialValues = {
//       id: book.id,
//       image: book.image,
//       link: book.link,
//       pages: book.pages,
//       readedPages: book.readedPages,
//       type: book.type,
//       finished: book.finished,
//       enTitle: en?.title,
//       enDescription: en?.description,
//       enAuthor: en?.author,
//       kaTitle: ka?.title,
//       kaDescription: ka?.description,
//       kaAuthor: ka?.author,
//     };

//     form.setFieldsValue(initialValues);
//     setValue(en?.description || "");
//   };

//   const handleDelete = (id: string) => {
//     deleteBook({ variables: { id } });
//   };

//   const handleCancel = () => {
//     setCurrentBook(null);
//     form.resetFields();
//     setValue("");
//     setImageUrl(null);
//     setIsModalVisible(false);
//   };

//   const handleImageUpload = async (file: File) => {
//     try {
//       setLoadingImage(true);
//       const result = await uploadToCloudinary(file); // Assuming uploadToCloudinary returns the URL
//       setImageUrl(result.secure_url);
//       form.setFieldsValue({ image: result.secure_url });
//     } catch (error) {
//       message.error("Error uploading image.");
//     } finally {
//       setLoadingImage(false);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error...</div>;
//   }

//   return (
//     <div>
//       <Button
//         type="primary"
//         onClick={() => {
//           setCurrentBook(null);
//           form.resetFields();
//           setValue("");
//           setIsModalVisible(true);
//         }}
//       >
//         Add Book
//       </Button>
//       <List
//         dataSource={data?.findManyBooks}
//         renderItem={(item: Book) => (
//           <List.Item
//             actions={[
//               <Button type="link" onClick={() => handleEdit(item)}>
//                 Edit
//               </Button>,
//               <Button type="link" danger onClick={() => handleDelete(item.id)}>
//                 Delete
//               </Button>,
//             ]}
//           >
//             {
//               item.translations.find(
//                 (t: BookTranslation) => t.languageCode === "en"
//               )?.title
//             }
//           </List.Item>
//         )}
//       />
//       <Modal visible={isModalVisible} onCancel={handleCancel} footer={null}>
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={(values) => {
//             console.log(values);
//             const input = {
//               ...values,
//               id: currentBook?.id,
//               image: imageUrl || values.image,
//             };

//             if (currentBook) {
//               updateBook({
//                 variables: {
//                   id: currentBook.id,
//                   data: {
//                     image: input.image,
//                     link: input.link,
//                     pages: input.pages,
//                     readedPages: input.readedPages,
//                     type: input.type,
//                     finished: input.finished,
//                     translations: {
//                       updateMany: [
//                         {
//                           where: { languageCode: { equals: "ka" } },
//                           data: {
//                             title: input.kaTitle,
//                             description: input.kaDescription,
//                             author: input.kaAuthor,
//                           },
//                         },
//                         {
//                           where: { languageCode: { equals: "en" } },
//                           data: {
//                             title: input.enTitle,
//                             description: input.enDescription,
//                             author: input.enAuthor,
//                           },
//                         },
//                       ],
//                     },
//                   },
//                 },
//               });
//             } else {
//               createBook({
//                 variables: {
//                   data: {
//                     index: input.index,
//                     pages: input.pages,
//                     readedPages: input.readedPages,
//                     type: input.type,
//                     image: input.image,
//                     link: input.link,
//                     finished: input.finished,
//                     translations: {
//                       createMany: {
//                         data: [
//                           {
//                             title: input.kaTitle,
//                             description: input.kaDescription,
//                             author: input.kaAuthor,
//                             languageCode: "ka",
//                           },
//                           {
//                             title: input.enTitle,
//                             description: input.enDescription,
//                             author: input.enAuthor,
//                             languageCode: "en",
//                           },
//                         ],
//                       },
//                     },
//                   },
//                 },
//               });
//             }

//             handleCancel();
//           }}
//         >
//           <Form.Item label="Image" name="image">
//             <FileUpload onUpload={handleImageUpload} />
//           </Form.Item>
//           <Form.Item label="Link" name="link">
//             <Input />
//           </Form.Item>
//           <Form.Item label="ID" name="id">
//             <Input />
//           </Form.Item>
//           <Form.Item label="Pages" name="pages">
//             <Input />
//           </Form.Item>
//           <Form.Item label="Readed Pages" name="readedPages">
//             <Input />
//           </Form.Item>
//           <Form.Item label="Type" name="type">
//             <Input />
//           </Form.Item>
//           <Form.Item label="Finished" name="finished" valuePropName="checked">
//             <Input type="checkbox" />
//           </Form.Item>
//           <Form.Item label="English Title" name="enTitle">
//             <Input />
//           </Form.Item>
//           <Form.Item label="English Description" name="enDescription">
//             <Input.TextArea />
//           </Form.Item>
//           <Form.Item label="English Author" name="enAuthor">
//             <Input />
//           </Form.Item>
//           <Form.Item label="Georgian Title" name="kaTitle">
//             <Input />
//           </Form.Item>
//           <Form.Item label="Georgian Description" name="kaDescription">
//             <Input.TextArea />
//           </Form.Item>
//           <Form.Item label="Georgian Author" name="kaAuthor">
//             <Input />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Submit
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default Books;
