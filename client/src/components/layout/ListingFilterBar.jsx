import React from 'react';
import { Row, Col, Form, Button, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

const ListingFilterBar = ({
                              searchTerm,
                              setSearchTerm,
                              campusFilter,
                              setCampusFilter,
                              furnishedOnly,
                              setFurnishedOnly,
                              verifiedOnly,
                              setVerifiedOnly,
                              sortOrder,
                              setSortOrder,
                              availabilitySort,
                              setAvailabilitySort,
                              rentLimit,
                              setRentLimit,
                              onReset
                          }) => {
    const toggleVariant = (active) => (active ? 'dark' : 'outline-light');

    const handleSortOrderChange = (val) => {
        setAvailabilitySort('');
        setSortOrder(val);
    };

    const handleAvailabilityChange = (val) => {
        setSortOrder('');
        setAvailabilitySort(val);
    };

    return (
        <Row className="g-2 align-items-center mb-3 flex-wrap">
            {/* Search */}
            <Col xs={12} sm={6} md={3}>
                <Form.Control
                    size="sm"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Col>

            {/* Campus dropdown */}
            <Col xs={6} sm={3} md={2}>
                <Form.Select
                    size="sm"
                    value={campusFilter}
                    onChange={(e) => setCampusFilter(e.target.value)}
                >
                    <option value="">All Campuses</option>
                    <option value="Surrey">Surrey</option>
                    <option value="Richmond">Richmond</option>
                    <option value="Langley">Langley</option>
                </Form.Select>
            </Col>

            {/* Furnished toggle */}
            <Col xs="auto">
                <Button
                    variant={toggleVariant(furnishedOnly)}
                    onClick={() => setFurnishedOnly(!furnishedOnly)}
                    size="sm"
                >
                    Furnished
                </Button>
            </Col>

            {/* Verified toggle */}
            <Col xs="auto">
                <Button
                    variant={toggleVariant(verifiedOnly)}
                    onClick={() => setVerifiedOnly(!verifiedOnly)}
                    size="sm"
                >
                    Verified
                </Button>
            </Col>

            {/* Sort Order toggle */}
            <Col xs="auto">
                <ToggleButtonGroup
                    type="radio"
                    name="sortOrder"
                    value={sortOrder}
                    onChange={handleSortOrderChange}
                >
                    <ToggleButton
                        id="sort-newest"
                        size="sm"
                        variant={toggleVariant(sortOrder === 'newest')}
                        value="newest"
                    >
                        Newest
                    </ToggleButton>
                    <ToggleButton
                        id="sort-oldest"
                        size="sm"
                        variant={toggleVariant(sortOrder === 'oldest')}
                        value="oldest"
                    >
                        Oldest
                    </ToggleButton>
                </ToggleButtonGroup>
            </Col>

            {/* Availability toggle */}
            <Col xs="auto">
                <ToggleButtonGroup
                    type="radio"
                    name="availabilitySort"
                    value={availabilitySort}
                    onChange={handleAvailabilityChange}
                >
                    <ToggleButton
                        id="avail-soon"
                        size="sm"
                        variant={toggleVariant(availabilitySort === 'soonest')}
                        value="soonest"
                    >
                        Available Soon
                    </ToggleButton>
                    <ToggleButton
                        id="avail-later"
                        size="sm"
                        variant={toggleVariant(availabilitySort === 'latest')}
                        value="latest"
                    >
                        Available Later
                    </ToggleButton>
                </ToggleButtonGroup>
            </Col>

            {/* Rent slider */}
            <Col xs={12} sm={6} md={3}>
                <Form.Range
                    min={0}
                    max={2000}
                    value={rentLimit}
                    onChange={(e) => setRentLimit(Number(e.target.value))}
                />
                <div className="text-white small text-center">Max Rent: ${rentLimit}</div>
            </Col>

            {/* Reset button */}
            <Col xs="auto">
                <Button size="sm" variant="warning" onClick={onReset}>
                    Reset Filters
                </Button>
            </Col>
        </Row>
    );
};

export default ListingFilterBar;
