export function TableColumns({ handleDetails }) {
  return [
    {
      id: 'icon',
      label: '',
      render: (rowData) => {},
    },
    {
      id: 'description',
      label: 'Descrição',
      render: (rowData) =>{},
    },
    {
      align: 'center',
      id: 'sponsor',
      label: 'Patrocinador',
      render: (rowData) => {},
    },
    {
      align: 'center',
      id: 'status',
      label: 'Status',
      render: (rowData) => {}
    },
    {
      align: 'center',
      id: 'action',
      label: 'Ação',
      padding: '0px',
      render: (rowData) => {},
    },
  ];
}
