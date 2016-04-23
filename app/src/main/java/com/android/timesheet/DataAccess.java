package com.android.timesheet;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteCursorDriver;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteQuery;
import android.util.Log;
import android.webkit.JavascriptInterface;
import java.lang.reflect.Array;

/**
 * Created by user on 4/18/2016.
 */
public class DataAccess {
    private SQLiteDatabase db;

    public DataAccess(Context context){

        try {
            //create database
            db = context.openOrCreateDatabase("Session", context.getApplicationContext().MODE_PRIVATE, null);

            String strSQL = "CREATE TABLE IF NOT EXISTS AuthenticatedUser ( " +
                    "                Id             INTEGER NOT NULL DEFAULT 0," +
                    "                FullName       TEXT NOT NULL DEFAULT ''," +
                    "                CalendarId     INTEGER NOT NULL DEFAULT 0," +
                    "                PositionId     INTEGER NOT NULL DEFAULT 0," +
                    "                IsManager      INTEGER NOT NULL DEFAULT 0," +
                    "                Address        TEXT NOT NULL DEFAULT ''," +
                    "                IsNotified     INTEGER NOT NULL DEFAULT 0," +
                    "                Token          TEXT NOT NULL DEFAULT ''," +
                    "                PRIMARY KEY(Id)" +
                    "                )";
            db.execSQL(strSQL);

            strSQL = "CREATE TABLE IF NOT EXISTS Role (" +
                    "UserId     INTEGER NOT NULL DEFAULT 0," +
                    "Role       TEXT NOT NULL DEFAULT ''," +
                    "PRIMARY KEY(UserId,Role))";
            db.execSQL(strSQL);
        }
        catch (Exception e){
            Log.d("******-da.cons->",e.getMessage());
        }
    }
    public void insertAuthenticatedUser(int id, String fullName, int calendarId, int positionId, int isManager, String address, int isNotified, String token){
        try{
            String strSQL = "INSERT INTO AuthenticatedUser(Id,FullName,CalendarId,PositionId,IsManager,Address,IsNotified,Token) VALUES (" + id + ",'" + fullName + "'," + calendarId + "," + positionId + "," + isManager + ",'" + address + "'," + isNotified + ",'" + token + "');";
            db.execSQL(strSQL);
        }
        catch (Exception e)
        {
            Log.d("******-da.insuser->",e.getMessage());
        }
    }
    public void insertRole(int userId, String role) {
        try{
            String strSQL = "INSERT INTO Role (UserId,Role) VALUES (" + userId + ",'" + role + "');";
            db.execSQL(strSQL);
        }
        catch (Exception e)
        {
            Log.d("******-da.insuser->",e.getMessage());
        }
    }
    public void deleteAuthenticatedUsers() {
        try{
            String strSQL = "DELETE FROM AuthenticatedUser ";
            db.execSQL(strSQL);
        }
        catch (Exception e)
        {
            Log.d("deleteUsers->",e.getMessage());
        }
    }
    public void deleteAuthenticatedUser(int id) {
        try{
            String strSQL = "DELETE FROM AuthenticatedUser WHERE Id = " + id;
            db.execSQL(strSQL);
        }
        catch (Exception e)
        {
            Log.d("******-da.insuser->",e.getMessage());
        }
    }
    public void deleteRole(int userId, String role) {
        try{
            String strSQL = "DELETE FROM Role WHERE UserId = " + userId + " AND Role = '" + role + "'";
            db.execSQL(strSQL);
        }
        catch (Exception e)
        {
            Log.d("******-da.insuser->",e.getMessage());
        }
    }
    public void deleteRoles(int userId) {
        try{
            String strSQL = "DELETE FROM Role WHERE UserId = " + userId;
            db.execSQL(strSQL);
        }
        catch (Exception e)
        {
            Log.d("******-da.insuser->",e.getMessage());
        }
    }
    public void deleteRoles() {
        try{
            String strSQL = "DELETE FROM Role ";
            db.execSQL(strSQL);
        }
        catch (Exception e)
        {
            Log.d("******-da.insuser->",e.getMessage());
        }
    }
    public AuthenticatedUser getAuthenticatedUser(int id) {
        try{
            String strSQL = "SELECT Id,FullName,CalendarId,PositionId,IsManager,Address,IsNotified,Token FROM AuthenticatedUser WHERE Id = " + id;
            Cursor rs = db.rawQuery(strSQL, null);
            if (rs.moveToFirst() == true) {

                AuthenticatedUser row = new AuthenticatedUser();
                row.Id = rs.getInt(0);
                row.FullName = rs.getString(1);
                row.CalendarId = rs.getInt(2);
                row.PositionId = rs.getInt(3);
                row.IsManager = rs.getInt(4);
                row.Address = rs.getString(5);
                row.IsNotified = rs.getInt(6);
                row.Token = rs.getString(7);
                return row;
            }
            return null;
        }
        catch (Exception e)
        {
            Log.d("******-da.gtuser->",e.getMessage());
            return null;
        }
    }
    public Role[] getRoles(int userId) {
        try{
            String strSQL = "SELECT UserId,Role FROM Role WHERE UserId = " + userId;
            Cursor rs = db.rawQuery(strSQL, null);

            if (rs.getCount() == 0)
                return new Role[0];
            else {

                Role[] result = new Role[rs.getCount()];
                int index = 0;
                while (rs.moveToNext()){
                    result[index] = new Role();
                    result[index].UserId = rs.getInt(0);
                    result[index].Role = rs.getString(1);
                    index++;
                }
                return result;
            }
        }
        catch (Exception e)
        {
            Log.d("******-da.gtroles->",e.getMessage());
            return null;
        }
    }

    @JavascriptInterface
    public AuthenticatedUser isExistSession(){
        try {
            String strSQL = "SELECT Id,FullName,CalendarId,PositionId,IsManager,Address,IsNotified,Token FROM AuthenticatedUser";
            Cursor rs = db.rawQuery(strSQL, null);
            if (rs.moveToFirst() == true) {

                AuthenticatedUser row = new AuthenticatedUser();
                row.Id = rs.getInt(0);
                row.FullName = rs.getString(1);
                row.CalendarId = rs.getInt(2);
                row.PositionId = rs.getInt(3);
                row.IsManager = rs.getInt(4);
                row.Address = rs.getString(5);
                row.IsNotified = rs.getInt(6);
                row.Token = rs.getString(7);
                return row;
            }
            return null;
        }
        catch (Exception e) {
            Log.d("isExistSession->",e.getMessage());
            return null;
        }
    }

    @JavascriptInterface  //for debugging purposes
    public void log(String input) {
        Log.d("", input);
    }

    @JavascriptInterface
    public void clearSession(){
        deleteAuthenticatedUsers();
        deleteRoles();
    }

    @JavascriptInterface
    public void createSession(int id, String fullName, int calendarId, int positionId, int isManager, String address, int isNotified, String token, String Roles){
        try {

            deleteAuthenticatedUser(id);
            insertAuthenticatedUser(id, fullName, calendarId, positionId, isManager, address, isNotified, token);

            deleteRoles(id);
            for (String role :Roles.split(",")) {
                Log.d("....",role);
                //insertRole(id, role);
            }
            Log.d("....","createSession> user session is created");
        }
        catch (Exception e) {
            Log.d("","createSession-$$$$>" + e.getMessage());
        }
    }
}
