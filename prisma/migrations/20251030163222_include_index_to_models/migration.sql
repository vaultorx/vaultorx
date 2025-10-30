-- CreateIndex
CREATE INDEX "collections_name_description_idx" ON "collections"("name", "description");

-- CreateIndex
CREATE INDEX "collections_totalVolume_idx" ON "collections"("totalVolume");

-- CreateIndex
CREATE INDEX "exhibitions_title_description_idx" ON "exhibitions"("title", "description");

-- CreateIndex
CREATE INDEX "exhibitions_tags_idx" ON "exhibitions"("tags");

-- CreateIndex
CREATE INDEX "exhibitions_views_idx" ON "exhibitions"("views");

-- CreateIndex
CREATE INDEX "nft_items_name_description_idx" ON "nft_items"("name", "description");

-- CreateIndex
CREATE INDEX "nft_items_isListed_idx" ON "nft_items"("isListed");

-- CreateIndex
CREATE INDEX "nft_items_views_idx" ON "nft_items"("views");

-- CreateIndex
CREATE INDEX "users_username_name_email_idx" ON "users"("username", "name", "email");
