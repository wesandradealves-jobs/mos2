import React from 'react';
import MuiTable from '@material-ui/core/Table';
import TablePagination from './MyTablePagination';

export const defaultFooterStyles = {};

class TableFooter extends React.Component {
  render() {
    const {
      options,
      rowCount,
      page,
      rowsPerPage,
      changeRowsPerPage,
      changePage,
    } = this.props;

    return (
      <MuiTable>
        {options.customFooter
          ? options.customFooter(
              rowCount,
              page,
              rowsPerPage,
              changeRowsPerPage,
              changePage,
              options.textLabels.pagination
            )
          : options.pagination && (
              <TablePagination
                totalItems={rowCount}
                limit={rowsPerPage}
                changePage={changePage}
              />
            )}
      </MuiTable>
    );
  }
}

export default TableFooter;
