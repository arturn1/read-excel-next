'use client';
import React, { useState, useEffect } from 'react';
import { Upload, Button, Layout, Typography, Table, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';

const { Content } = Layout;
const { Title } = Typography;

const FileUploader = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isClient, setIsClient] = useState(false); // Flag para verificar se está no cliente
  const [catFact, setCatFact] = useState<string | null>(null); // Estado para o fato de gato

  // Usar useEffect para definir que estamos no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Função para buscar um fato de gato
  const fetchCatFact = async () => {
    try {
      const response = await fetch('https://catfact.ninja/fact');
      const data = await response.json();
      setCatFact(data.fact); // Salva o fato de gato no estado
    } catch (error) {
      message.error('Erro ao buscar o fato de gato.');
    }
  };

  // Configurações do componente de upload
  const uploadProps = {
    onRemove: (file: UploadFile) => {
      setFileList([]);
    },
    beforeUpload: (file: RcFile) => {
      const newFile: UploadFile = {
        uid: file.uid,
        name: file.name,
        size: file.size,
        status: 'done',
        url: '',
        originFileObj: file,
      };
      setFileList([newFile]);
      return false; // Impede o upload automático
    },
    fileList,
  };

  // Colunas da tabela
  const columns = [
    {
      title: 'Nome do Arquivo',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tamanho (MB)',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => (size / (1024 * 1024)).toFixed(2), // Converte bytes para MB
    },
  ];

  if (!isClient) {
    // Renderiza um placeholder vazio no lado do servidor
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Content style={{ textAlign: 'center' }}>
        <Title level={2}>Upload de Arquivo e Fato Aleatório de Gato</Title>

        <Upload {...uploadProps} maxCount={1}>
          <Button icon={<UploadOutlined />}>Selecionar Arquivo</Button>
        </Upload>

        {fileList.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <Title level={4}>Informações do Arquivo:</Title>
            <Table dataSource={fileList} columns={columns} rowKey="uid" />
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          <Button type="primary" onClick={fetchCatFact}>
            Obter Fato de Gato
          </Button>

          {catFact && (
            <div style={{ marginTop: 32 }}>
              <Title level={4}>Fato Aleatório de Gato:</Title>
              <p>{catFact}</p>
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default FileUploader;
