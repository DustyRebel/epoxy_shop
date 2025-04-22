import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../index";
import { Pagination } from "react-bootstrap";

const GPages = observer(() => {
    const {gallery_item} = useContext(Context)
    const pageCount = Math.ceil(gallery_item.totalCount / gallery_item.limit)
    const pages = []

    for (let i = 0; i < pageCount+1; i++) {
        pages.push(i + 1)
    }

    return (
        <Pagination className="mt-3">
            {pages.map(page =>
                <Pagination.Item
                    key={page}
                    active={gallery_item.page === page}
                    onClick={() => gallery_item.setPage(page)}
                >
                    {page}
                </Pagination.Item>
            )}
        </Pagination>
    );
});

export default GPages;