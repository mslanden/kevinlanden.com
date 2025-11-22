-- Seed data for Best in Show items
-- This migration populates the best_in_show_items table with the existing hardcoded content

-- Photography Section
INSERT INTO best_in_show_items (section, item_type, title, description, image_url, display_order, is_active)
VALUES
('photography', 'gallery-item', 'Residential Interior', 'Professional lighting and composition techniques highlight architectural features and create inviting spaces.', '/images/photo-example-1.jpeg', 1, true),
('photography', 'gallery-item', 'Exterior Showcase', 'Carefully timed outdoor photography captures curb appeal and surrounding landscape features.', '/images/photo-example-2.jpeg', 2, true),
('photography', 'gallery-item', 'Drone Photography', 'Stunning aerial perspectives that capture the full scope of the property, landscape, and surrounding views.', '/images/photo-example-3.jpeg', 3, true);

-- Virtual Staging Section
INSERT INTO best_in_show_items (section, item_type, title, description, image_url_before, image_url, display_order, is_active)
VALUES
('virtual-staging', 'before-after', 'Living Room Transformation', 'Virtual staging adds modern furniture and decor to empty spaces, helping buyers visualize the living potential.', '/images/virtual-before-1.jpeg', '/images/virtual-after-1.jpeg', 1, true),
('virtual-staging', 'before-after', 'Master Bedroom Enhancement', 'Virtual staging creates warm and inviting bedroom spaces that showcase the room''s true potential.', '/images/virtual-before-2.jpeg', '/images/virtual-after-2.jpeg', 2, true);

-- Item Removal Section
INSERT INTO best_in_show_items (section, item_type, title, description, image_url_before, image_url, display_order, is_active)
VALUES
('item-removal', 'before-after', 'Restaged Living Space', 'Digital restaging removes clutter and reimagines the space with inviting, updated furnishings for a fresh look.', '/images/removal-before-1.jpeg', '/images/removal-after-1.jpeg', 1, true),
('item-removal', 'before-after', 'Item Removal', 'See how a clutter-free, empty space allows buyers to appreciate the room''s size and envision their own furnishings—making it easier to imagine the possibilities.', '/images/removal-before-2.jpeg', '/images/removal-after-2.jpeg', 2, true);

-- 3D Tours & Floor Plans Section
INSERT INTO best_in_show_items (section, item_type, title, description, embed_url, display_order, is_active)
VALUES
('3d-tours', 'iframe-embed', 'Zillow 3D Tour', 'Interactive 3D tour of a property listing.', 'https://www.zillow.com/view-imx/bf81432d-958e-42c7-9412-5200c94d443d?initialViewType=pano&utm_source=dashboard', 1, true);

INSERT INTO best_in_show_items (section, item_type, title, description, image_url, display_order, is_active)
VALUES
('3d-tours', 'gallery-item', 'Floor Plans', 'Detailed floor plans help buyers understand the layout and flow of the property.', '/images/floorplan.jpeg', 2, true);

-- Note: The Kuula 360° PhotoSphere needs to be replaced with an actual 360 image upload
-- For now, this is a placeholder that should be updated through the admin interface
-- INSERT INTO best_in_show_items (section, item_type, title, description, image_url, display_order, is_active)
-- VALUES
-- ('3d-tours', '360-viewer', '360° PhotoSpheres', 'Immersive 360-degree views of key rooms and outdoor areas provide a realistic virtual experience.', 'REPLACE_WITH_360_IMAGE_URL', 3, true);
