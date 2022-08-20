using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Acciones.Models;
using Microsoft.Data.SqlClient;

namespace Acciones.Controllers
{
    public class CallesController : Controller
    {
        private readonly dbAccionesContext _context;

        public CallesController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Calles
        public async Task<IActionResult> Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            var dbAccionesContext = _context.Calles.Include(c => c.Colonia);
            return View(await dbAccionesContext.ToListAsync());
        }

        // GET: Calles/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var calle = await _context.Calles
                .Include(c => c.Colonia)
                .FirstOrDefaultAsync(m => m.CalleId == id);
            if (calle == null)
            {
                return NotFound();
            }

            return View(calle);
        }

        // GET: Calles/Create
        public IActionResult Create()
        {
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia");
            return View();
        }

        // POST: Calles/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("CalleId,NombreCalle,Manzana,Distrito,Seccion,Lote,Estatus,ColoniaId")] Calle calle)
        {
            if (ModelState.IsValid)
            {
                calle.Estatus = 1;
                _context.Add(calle);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", calle.ColoniaId);
            return View(calle);
        }

        // GET: Calles/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var calle = await _context.Calles.FindAsync(id);
            if (calle == null)
            {
                return NotFound();
            }
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", calle.ColoniaId);
            return View(calle);
        }

        // POST: Calles/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("CalleId,NombreCalle,Manzana,Distrito,Seccion,Lote,Estatus,ColoniaId")] Calle calle)
        {
            if (id != calle.CalleId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(calle);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CalleExists(calle.CalleId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", calle.ColoniaId);
            return View(calle);
        }

        // GET: Calles/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var calle = await _context.Calles
                .Include(c => c.Colonia)
                .FirstOrDefaultAsync(m => m.CalleId == id);
            if (calle == null)
            {
                return NotFound();
            }

            return View(calle);
        }

        // POST: Calles/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var calle = await _context.Calles.FindAsync(id);
            _context.Calles.Remove(calle);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CalleExists(int id)
        {
            return _context.Calles.Any(e => e.CalleId == id);
        }

        /*************************************************************************************
         *  Buscar Calles
         *************************************************************************************/
        public JsonResult BusquedaCalles(string term, int coloniaId)
        {
            {
                var nombresCalles = _context.Calles.Where(c => c.NombreCalle.Contains(term) && c.ColoniaId==coloniaId).Select(c => new { aNombreCalle = c.NombreCalle, id = c.CalleId }).ToList();
                return Json(nombresCalles);
            }
        }


        /************************************************************
            Guardar Nueva Calle
        *************************************************************/
        [HttpPost]
        public int RegistraNuevaCalle(string nombreCalle, int coloniaId)
        {
            if (_context.Calles.Where(c => c.NombreCalle == nombreCalle).Any())       //  Verifica que no exista una Calle con el mismo nombre
            {
                return 0;
            }

            Calle calle = new Calle();
            calle.NombreCalle = nombreCalle;
            calle.Manzana = "0";
            calle.Seccion = "0";
            calle.Distrito = "0";
            calle.Lote = "0";
            calle.Estatus = 1;
            calle.ColoniaId = coloniaId;
            try
            {
                _context.Calles.Add(calle);
                _context.SaveChanges();
                if (calle.CalleId != 0)
                {
                    return calle.CalleId;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Insertar una Calle: {0}", e.Message);
                return -1;
            }
            return calle.CalleId;
        }

        /*******************************************************************
            Obtiene Calles de una Colonia
        ********************************************************************/
        public IEnumerable<Calle> ObtieneCalles(int coloniaId)
        {
            string stm = "";
            List<Calle> ListaObjetos = new List<Calle>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();

            conn.Open();

                stm = "SELECT CalleID, NombreCalle " +
                        " FROM Calles WHERE Estatus = 1 AND ColoniaID = " + coloniaId;

            SqlCommand cmd_p = new SqlCommand(stm, conn);

            SqlDataReader query = cmd_p.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    Calle obj = new Calle();
                    obj.CalleId = query.GetInt32(0);
                    obj.NombreCalle = query.GetString(1);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }
    }
}
