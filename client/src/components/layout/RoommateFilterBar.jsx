import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import './RoommateFilterBar.css';

const RoommateFilterBar = ({
                               searchTerm,
                               setSearchTerm,
                               sameGenderOnly,
                               setSameGenderOnly,
                               onlyVerified,
                               setOnlyVerified,
                               campusFilter,
                               setCampusFilter,
                               budgetRange,
                               setBudgetRange,
                               onReset
                           }) => {
    const maxBudget = Array.isArray(budgetRange) && budgetRange.length === 2
        ? budgetRange[1]
        : 4000;

    return (
        <Row className="g-3 mb-4 align-items-end flex-nowrap roommate-filter-bar">

            {/* 🔍 Search */}
            <Col xs="auto">
                <Form.Label className="fw-semibold">Search</Form.Label>
                <Form.Control
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </Col>

            {/* 🔘 Bubble Toggles */}
            <Col xs="auto">
                <Form.Label className="fw-semibold d-block">Filters</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                    <div
                        className={`bubble-toggle ${sameGenderOnly ? 'active' : ''}`}
                        onClick={() => setSameGenderOnly(!sameGenderOnly)}
                    >
                        Same Gender
                    </div>
                    <div
                        className={`bubble-toggle ${onlyVerified ? 'active' : ''}`}
                        onClick={() => setOnlyVerified(!onlyVerified)}
                    >
                        Only Verified
                    </div>
                </div>
            </Col>

            {/* 🏫 Campus Filter */}
            <Col xs="auto">
                <Form.Label className="fw-semibold">Campus</Form.Label>
                <Form.Select
                    value={campusFilter}
                    onChange={(e) => setCampusFilter(e.target.value)}
                >
                    <option value="">All Campuses</option>
                    <option value="Surrey">Surrey</option>
                    <option value="Richmond">Richmond</option>
                    <option value="Langley">Langley</option>
                    <option value="Civic Plaza">Civic Plaza</option>
                </Form.Select>
            </Col>

            {/* 💰 Budget Slider */}
            <Col xs="auto">
                <Form.Label className="fw-semibold">Max Budget: ${maxBudget}</Form.Label>
                <Form.Range
                    min={0}
                    max={4000}
                    step={50}
                    value={maxBudget}
                    onChange={(e) => setBudgetRange([0, Number(e.target.value)])}
                    className="custom-range"
                />

            </Col>

            {/* 🔁 Reset Button */}
            <Col xs="auto">
                <Form.Label className="invisible">Reset</Form.Label>
                <Button
                    variant="outline-info"
                    onClick={onReset}
                >
                    Reset Filters
                </Button>
            </Col>
        </Row>
    );
};

export default RoommateFilterBar;
