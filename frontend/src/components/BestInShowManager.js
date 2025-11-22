import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert, Spinner, Modal, Tabs, Tab, Row, Col, Badge } from 'react-bootstrap';
import styled from 'styled-components';

const ManagerContainer = styled.div`
  padding: 2rem 0;
`;

const ItemCard = styled(Card)`
  margin-bottom: 1rem;
  border: 1px solid #dee2e6;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const ImagePreview = styled.img`
  max-width: 200px;
  max-height: 150px;
  object-fit: cover;
  border-radius: 4px;
  margin: 0.5rem;
`;

const BeforeAfterPreview = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const BestInShowManager = () => {
  const [items, setItems] = useState({
    photography: [],
    'virtual-staging': [],
    'item-removal': [],
    '3d-tours': []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [currentSection, setCurrentSection] = useState('photography');
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    section: 'photography',
    item_type: 'gallery-item',
    title: '',
    description: '',
    image_url: '',
    image_url_before: '',
    embed_url: '',
    display_order: 0,
    is_active: true
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_URL}/best-in-show/admin/all`, {
        credentials: 'include' // Important: includes httpOnly cookies
      });

      if (!response.ok) throw new Error('Failed to fetch items');

      const data = await response.json();
      setItems(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = async (file, fieldName) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', currentSection);

      const response = await fetch(`${API_URL}/upload/best-in-show-image`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const data = await response.json();

      setFormData(prev => ({
        ...prev,
        [fieldName]: data.data.publicUrl
      }));

      setSuccess('Image uploaded successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingItem
        ? `${API_URL}/best-in-show/${editingItem.id}`
        : `${API_URL}/best-in-show`;

      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error(`Failed to ${editingItem ? 'update' : 'create'} item`);

      setSuccess(`Item ${editingItem ? 'updated' : 'created'} successfully!`);
      setShowModal(false);
      resetForm();
      fetchItems();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`${API_URL}/best-in-show/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete item');

      setSuccess('Item deleted successfully!');
      fetchItems();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      section: item.section,
      item_type: item.item_type,
      title: item.title,
      description: item.description || '',
      image_url: item.image_url || '',
      image_url_before: item.image_url_before || '',
      embed_url: item.embed_url || '',
      display_order: item.display_order,
      is_active: item.is_active
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      section: currentSection,
      item_type: 'gallery-item',
      title: '',
      description: '',
      image_url: '',
      image_url_before: '',
      embed_url: '',
      display_order: 0,
      is_active: true
    });
  };

  const openAddModal = (section) => {
    setCurrentSection(section);
    resetForm();
    setFormData(prev => ({ ...prev, section }));
    setShowModal(true);
  };

  const renderItemPreview = (item) => {
    if (item.item_type === 'before-after') {
      return (
        <BeforeAfterPreview>
          <div>
            <div><strong>Before:</strong></div>
            {item.image_url_before && <ImagePreview src={item.image_url_before} alt="Before" />}
          </div>
          <div>
            <div><strong>After:</strong></div>
            {item.image_url && <ImagePreview src={item.image_url} alt="After" />}
          </div>
        </BeforeAfterPreview>
      );
    } else if (item.item_type === '360-viewer') {
      return <ImagePreview src={item.image_url} alt="360 View" />;
    } else if (item.item_type === 'iframe-embed') {
      return <div><strong>Embed URL:</strong> {item.embed_url}</div>;
    } else {
      return item.image_url && <ImagePreview src={item.image_url} alt={item.title} />;
    }
  };

  const renderSectionItems = (section) => {
    const sectionItems = items[section] || [];

    if (sectionItems.length === 0) {
      return (
        <Alert variant="info">
          No items in this section yet. Click "Add New Item" to get started.
        </Alert>
      );
    }

    return sectionItems.map(item => (
      <ItemCard key={item.id}>
        <Card.Body>
          <Row>
            <Col md={8}>
              <h5>{item.title} <Badge bg={item.is_active ? 'success' : 'secondary'}>{item.is_active ? 'Active' : 'Inactive'}</Badge></h5>
              <p className="text-muted">{item.description}</p>
              <div><strong>Type:</strong> {item.item_type}</div>
              <div><strong>Display Order:</strong> {item.display_order}</div>
              {renderItemPreview(item)}
            </Col>
            <Col md={4} className="d-flex flex-column justify-content-center gap-2">
              <Button variant="primary" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
            </Col>
          </Row>
        </Card.Body>
      </ItemCard>
    ));
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <ManagerContainer>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Best in Show Manager</h2>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <Tabs activeKey={currentSection} onSelect={(k) => setCurrentSection(k)} className="mb-3">
        <Tab eventKey="photography" title="Photography">
          <div className="mb-3">
            <Button variant="success" onClick={() => openAddModal('photography')}>+ Add New Item</Button>
          </div>
          {renderSectionItems('photography')}
        </Tab>

        <Tab eventKey="virtual-staging" title="Virtual Staging">
          <div className="mb-3">
            <Button variant="success" onClick={() => openAddModal('virtual-staging')}>+ Add New Item</Button>
          </div>
          {renderSectionItems('virtual-staging')}
        </Tab>

        <Tab eventKey="item-removal" title="Item Removal">
          <div className="mb-3">
            <Button variant="success" onClick={() => openAddModal('item-removal')}>+ Add New Item</Button>
          </div>
          {renderSectionItems('item-removal')}
        </Tab>

        <Tab eventKey="3d-tours" title="3D Tours">
          <div className="mb-3">
            <Button variant="success" onClick={() => openAddModal('3d-tours')}>+ Add New Item</Button>
          </div>
          {renderSectionItems('3d-tours')}
        </Tab>
      </Tabs>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? 'Edit' : 'Add New'} Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Section</Form.Label>
              <Form.Select name="section" value={formData.section} onChange={handleInputChange} required>
                <option value="photography">Photography</option>
                <option value="virtual-staging">Virtual Staging</option>
                <option value="item-removal">Item Removal</option>
                <option value="3d-tours">3D Tours</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Item Type</Form.Label>
              <Form.Select name="item_type" value={formData.item_type} onChange={handleInputChange} required>
                <option value="gallery-item">Gallery Item (single image)</option>
                <option value="before-after">Before/After Comparison</option>
                <option value="360-viewer">360° Viewer</option>
                <option value="iframe-embed">Iframe Embed (Zillow, Matterport, etc.)</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
              />
            </Form.Group>

            {/* Conditional fields based on item type */}
            {formData.item_type === 'before-after' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Before Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'image_url_before')}
                  />
                  <Form.Text className="text-muted">Or enter URL directly:</Form.Text>
                  <Form.Control
                    type="text"
                    name="image_url_before"
                    value={formData.image_url_before}
                    onChange={handleInputChange}
                    placeholder="Enter before image URL"
                    className="mt-2"
                  />
                  {formData.image_url_before && <ImagePreview src={formData.image_url_before} alt="Before preview" />}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>After Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'image_url')}
                  />
                  <Form.Text className="text-muted">Or enter URL directly:</Form.Text>
                  <Form.Control
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="Enter after image URL"
                    className="mt-2"
                  />
                  {formData.image_url && <ImagePreview src={formData.image_url} alt="After preview" />}
                </Form.Group>
              </>
            )}

            {(formData.item_type === 'gallery-item' || formData.item_type === '360-viewer') && (
              <Form.Group className="mb-3">
                <Form.Label>{formData.item_type === '360-viewer' ? '360° Image' : 'Image'}</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'image_url')}
                  disabled={uploading}
                />
                <Form.Text className="text-muted">Or enter URL directly:</Form.Text>
                <Form.Control
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                  className="mt-2"
                />
                {formData.image_url && <ImagePreview src={formData.image_url} alt="Preview" />}
              </Form.Group>
            )}

            {formData.item_type === 'iframe-embed' && (
              <Form.Group className="mb-3">
                <Form.Label>Embed URL</Form.Label>
                <Form.Control
                  type="text"
                  name="embed_url"
                  value={formData.embed_url}
                  onChange={handleInputChange}
                  placeholder="Enter iframe embed URL (Zillow, Matterport, etc.)"
                  required
                />
                <Form.Text className="text-muted">
                  Example: https://www.zillow.com/view-imx/...
                </Form.Text>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Display Order</Form.Label>
              <Form.Control
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleInputChange}
                min="0"
              />
              <Form.Text className="text-muted">Lower numbers appear first</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                label="Active (visible on website)"
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={uploading}>
                {uploading ? 'Uploading...' : (editingItem ? 'Update Item' : 'Create Item')}
              </Button>
              <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </ManagerContainer>
  );
};

export default BestInShowManager;
