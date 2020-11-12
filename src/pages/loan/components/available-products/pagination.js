import React, { useState, useEffect, useCallback, useMemo } from 'react';

const LoanItemsPagination = ({
  totalItems,
  limit,
  setPage,
  totalAvailableItems,
}) => {
  const totalPages = Math.ceil(totalItems / limit);
  const [pages, setPages] = useState([0]);
  const [currentPage, setCurrentPage] = useState(1);

  const [showFirstEllipsis, setShowFirstEllipsis] = useState(false);
  const [showSecondEllipsis, setShowSecondEllipsis] = useState(false);

  useEffect(() => {
    if (limit * 5 < totalItems) {
      if (currentPage > 4) {
        setShowFirstEllipsis(true);
      } else {
        setShowFirstEllipsis(false);
      }
      if (currentPage < totalPages - 3) {
        setShowSecondEllipsis(true);
      } else {
        setShowSecondEllipsis(false);
      }
    }
  }, [currentPage, limit, totalItems, totalPages]);

  useEffect(() => {
    if (limit * 5 >= totalItems) {
      setPages(Array.from({ length: totalPages - 2 }, (_, i) => i + 2));
    } else if (currentPage < 5) {
      setPages([2, 3, 4, 5]);
    } else if (currentPage > totalPages - 4) {
      setPages([
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
      ]);
    } else {
      setPages([currentPage - 1, currentPage, currentPage + 1]);
    }
  }, [currentPage, limit, totalItems, totalPages]);

  useEffect(() => {
    if (totalItems) {
      setPage(currentPage);
    }
  }, [currentPage, setPage, totalItems]);

  const handlePageClick = useCallback(e => {
    setCurrentPage(parseInt(e.currentTarget.innerHTML, 10));
  }, []);

  const handlePreviousPageClick = useCallback(() => {
    setCurrentPage(parseInt(currentPage, 10) - 1);
  }, [currentPage]);

  const handleNextPageClick = useCallback(() => {
    setCurrentPage(parseInt(currentPage, 10) + 1);
  }, [currentPage]);

  const labelTotalAvailableItems = useMemo(
    () =>
      totalAvailableItems > 1
        ? `${totalAvailableItems} itens disponíveis`
        : `${totalAvailableItems} item disponível`,
    [totalAvailableItems]
  );
  if (totalPages) {
    return (
      <div className="pagination">
        <div className="left-side">{labelTotalAvailableItems}</div>
        <div className="right-side">
          <button
            className="action"
            type="button"
            onClick={handlePreviousPageClick}
            disabled={currentPage === 1}
          >
            {'<'}
          </button>
          <span>
            <button
              className={`${
                currentPage === 1 ? 'action -current' : 'action'
              } -number`}
              onClick={handlePageClick}
            >
              1
            </button>
            {showFirstEllipsis && <span>...</span>}
            {pages.map(_page => {
              return (
                <button
                  key={_page}
                  className={`${
                    _page === currentPage ? 'action -current' : 'action'
                  } -number`}
                  type="button"
                  onClick={handlePageClick}
                >
                  {_page}
                </button>
              );
            })}
            {showSecondEllipsis && <span>...</span>}
            <button
              className={`action -number ${currentPage === totalPages &&
                '-current'}
              ${limit >= totalItems && '-disable'}`}
              onClick={handlePageClick}
            >
              {totalPages}
            </button>
          </span>
          <button
            className="action"
            type="button"
            onClick={handleNextPageClick}
            disabled={currentPage === totalPages}
          >
            {'>'}
          </button>
        </div>
      </div>
    );
  }
  return <></>;
};

export default LoanItemsPagination;
