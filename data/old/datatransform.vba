Sub transform()

Dim intRowEnd, intColEnd, rowCount, colCount, countryDet As Integer
Dim currCountry, cellAddr, currRow As String
Dim findCell As Range
Dim disasterDict As Scripting.Dictionary

Set findCell = Nothing
Set disasterDict = New Scripting.Dictionary

disasterDict.Add "Drought", 5
disasterDict.Add "Extreme temperature", 6
disasterDict.Add "Flood", 7
disasterDict.Add "Landslide", 8
disasterDict.Add "Storm", 9
disasterDict.Add "Wildfire", 10
disasterDict.Add "TOTAL", 11

currRow = 2

With ThisWorkbook.Sheets(2)
    intRowEnd = .Range("D1").End(xlDown).Row
    intColEnd = .Range("D1").End(xlToRight).Column
    
    For rowCount = 1 To intRowEnd
        
        If LCase(Trim(.Range("D" & rowCount).Value)) = "total" Then
            
            currCountry = .Cells(rowCount, 3).Value
            
            If currCountry = "ZWE" Then
                On Error GoTo 0
            End If
            
            For colCount = 5 To intColEnd
                
                If .Cells(rowCount, colCount).Value <> "" Then
                    
                    For countryDet = 1 To 3
                        ThisWorkbook.Sheets(1).Cells(currRow, countryDet).Value = .Cells(rowCount, countryDet).Value
                    Next countryDet
                    
                    ThisWorkbook.Sheets(1).Cells(currRow, 4).Value = Replace(.Cells(1, colCount).Value, "F", "")
                    
                    Set findCell = .Range(.Cells(1, 3), .Cells(intRowEnd, 3)).Find(What:=currCountry, LookAt:=xlWhole)
                    cellAddr = findCell.Address
                    
                    Do
                        If .Cells(findCell.Row, colCount) <> "" Then
                             ThisWorkbook.Sheets(1).Cells(currRow, disasterDict(.Cells(findCell.Row, 4).Value)).Value = .Cells(findCell.Row, colCount).Value
                        End If
                        
                        Set findCell = .Range(.Cells(1, 3), .Cells(intRowEnd, 3)).FindNext(findCell)
                    Loop While findCell.Address <> cellAddr
                    
                    currRow = currRow + 1
                    
                End If
                
            Next colCount
            
        End If
    
    Next rowCount

End With

End Sub