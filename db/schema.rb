# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_04_24_211303) do
  create_table "conversations", force: :cascade do |t|
    t.integer "requester_id"
    t.integer "accepter_id"
    t.boolean "accepted"
    t.boolean "deleted"
    t.boolean "seen"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "edits", force: :cascade do |t|
    t.integer "message_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["message_id"], name: "index_edits_on_message_id"
  end

  create_table "languages", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "messages", force: :cascade do |t|
    t.string "text"
    t.integer "conversation_id", null: false
    t.integer "sender_id"
    t.integer "receiver_id"
    t.boolean "seen"
    t.boolean "initializer"
    t.boolean "edit"
    t.string "new_text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["conversation_id"], name: "index_messages_on_conversation_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "image"
    t.text "bio"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  create_table "users_languages", force: :cascade do |t|
    t.integer "user_id"
    t.integer "language_id"
    t.integer "skill_level"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "learning"
    t.index ["language_id"], name: "index_users_languages_on_language_id"
    t.index ["user_id"], name: "index_users_languages_on_user_id"
  end

  add_foreign_key "edits", "messages"
  add_foreign_key "messages", "conversations"
end
