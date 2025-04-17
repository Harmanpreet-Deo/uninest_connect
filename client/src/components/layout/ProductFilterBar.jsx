import React from 'react';
import { Form, Button, Row, Col, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

const ProductFilterBar = ({
                              searchTerm,
                              setSearchTerm,
                              sortOrder,
                              setSortOrder,
                              conditionFilter,
                              setConditionFilter,
                              categoryFilter,
                              setCategoryFilter,
                              categories,
                              priceSort,
                              setPriceSort,
                              onReset
                          }) => {
    const getToggleVariant = (isActive) => isActive ? 'custom-dark' : 'custom-outline-dark';

    return (
        <Row className="mb-3">
            {/* Left Column */}
            <Col lg={6}>
                <Row className="mb-2 pe-2">
                    <Form.Control
                        size="sm"
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Row>

                <Row className="mb-2">
                    <Col>
                        <ToggleButtonGroup
                            type="radio"
                            name="condition"
                            value={conditionFilter}
                            onChange={val => setConditionFilter(val)}
                        >
                            <ToggleButton
                                id="cond-new"
                                size="sm"
                                variant={getToggleVariant(conditionFilter === 'new')}
                                value="new"
                                className="custom-toggle"
                            >
                                New
                            </ToggleButton>
                            <ToggleButton
                                id="cond-used"
                                size="sm"
                                variant={getToggleVariant(conditionFilter === 'used')}
                                value="used"
                                className="custom-toggle"
                            >
                                Used
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                    <Col>
                        <ToggleButtonGroup
                            type="radio"
                            name="sortOrder"
                            value={sortOrder}
                            onChange={val => setSortOrder(val)}
                        >
                            <ToggleButton
                                id="sort-newest"
                                size="sm"
                                variant={getToggleVariant(sortOrder === 'newest')}
                                value="newest"
                                className="custom-toggle"
                            >
                                Newest
                            </ToggleButton>
                            <ToggleButton
                                id="sort-oldest"
                                size="sm"
                                variant={getToggleVariant(sortOrder === 'oldest')}
                                value="oldest"
                                className="custom-toggle"
                            >
                                Oldest
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Row>
            </Col>

            {/* Right Column */}
            <Col lg={6}>
                <Row className="mb-2">
                    <Form.Select
                        size="sm"
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat, idx) => (
                            <option key={idx} value={cat}>{cat}</option>
                        ))}
                    </Form.Select>
                </Row>

                <Row className="d-flex justify-content-between align-items-center">
                    <Col>
                        <ToggleButtonGroup
                            type="radio"
                            name="priceSort"
                            value={priceSort}
                            onChange={val => setPriceSort(val)}
                        >
                            <ToggleButton
                                id="sort-lowest"
                                size="sm"
                                variant={getToggleVariant(priceSort === 'lowest')}
                                value="lowest"
                                className="custom-toggle"
                            >
                                Lowest Price
                            </ToggleButton>
                            <ToggleButton
                                id="sort-highest"
                                size="sm"
                                variant={getToggleVariant(priceSort === 'highest')}
                                value="highest"
                                className="custom-toggle"
                            >
                                Highest Price
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                    <Col className="text-end">
                        <Button size="sm" variant="warning" onClick={onReset}>
                            Reset Filters
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default ProductFilterBar;
